<?php

namespace App\Services;

/**
 * HtmlSanitizer — Bersihkan HTML dari TipTap editor.
 *
 * Menggunakan DOMDocument PHP (built-in) untuk whitelist tag/atribut
 * yang diperbolehkan. Aman dari XSS tanpa dependency eksternal.
 */
class HtmlSanitizer
{
    /**
     * Tag HTML yang diizinkan dari TipTap StarterKit + Image + Link.
     *
     * @var array<string, string[]>  key = tag, value = allowed attributes
     */
    private static array $allowedTags = [
        'p'          => [],
        'br'         => [],
        'strong'     => [],
        'em'         => [],
        'b'          => [],
        'i'          => [],
        's'          => [],
        'u'          => [],
        'h2'         => [],
        'h3'         => [],
        'ul'         => [],
        'ol'         => [],
        'li'         => [],
        'blockquote' => [],
        'code'       => [],
        'pre'        => [],
        'hr'         => [],
        'img'        => ['src', 'alt', 'title', 'class', 'width', 'height'],
        'a'          => ['href', 'title', 'target', 'rel', 'class'],
    ];

    /**
     * Sanitasi HTML dan kembalikan versi yang sudah dibersihkan.
     */
    public static function clean(string $html): string
    {
        if (trim($html) === '' || $html === '<p></p>') {
            return '';
        }

        // 1. Purify via HTMLPurifier terlebih dahulu
        $config = \HTMLPurifier_Config::createDefault();
        $config->set('Core.Encoding', 'UTF-8');
        // Matikan cache definition agar tidak error permission di folder temp / serializer
        $config->set('Cache.DefinitionImpl', null);
        $purifier = new \HTMLPurifier($config);

        $purifiedHtml = $purifier->purify($html);

        if (trim($purifiedHtml) === '') {
            return '';
        }

        // 2. Lanjutkan dengan sanitasi kustom TipTap via Native DOMDocument
        $dom = new \DOMDocument('1.0', 'UTF-8');

        // Suppress malformed HTML warnings
        libxml_use_internal_errors(true);

        // Wrap with charset meta so UTF-8 chars (emoji, etc.) survive
        $dom->loadHTML(
            '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body>' . $purifiedHtml . '</body></html>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        libxml_clear_errors();

        $body = $dom->getElementsByTagName('body')->item(0);

        if ($body === null) {
            return '';
        }

        self::sanitizeNode($body);

        // Serialize only the inner body content (strip <body> wrapper)
        $result = '';
        foreach ($body->childNodes as $child) {
            $result .= $dom->saveHTML($child);
        }

        return trim($result);
    }

    /**
     * Recursively walk the DOM tree and remove disallowed nodes/attributes.
     */
    private static function sanitizeNode(\DOMNode $node): void
    {
        /** @var \DOMNode[] $toRemove */
        $toRemove = [];

        foreach ($node->childNodes as $child) {
            if ($child->nodeType === XML_ELEMENT_NODE) {
                /** @var \DOMElement $element */
                $element = $child;
                $tagName = strtolower($element->nodeName);

                if (!array_key_exists($tagName, self::$allowedTags)) {
                    // Replace disallowed element with its text content
                    $toRemove[] = $element;
                } else {
                    // Remove disallowed attributes
                    $allowedAttrs  = self::$allowedTags[$tagName];
                    $attrsToRemove = [];

                    foreach ($element->attributes as $attr) {
                        /** @var \DOMAttr $attr */
                        if (!in_array($attr->name, $allowedAttrs, true)) {
                            $attrsToRemove[] = $attr->name;
                        }
                    }

                    foreach ($attrsToRemove as $attrName) {
                        $element->removeAttribute($attrName);
                    }

                    // Force safe rel on links
                    if ($tagName === 'a') {
                        $element->setAttribute('rel', 'noopener noreferrer');
                        // Only allow http/https/mailto hrefs
                        $href = $element->getAttribute('href');
                        if (!preg_match('/^(https?:\/\/|mailto:)/i', $href)) {
                            $element->removeAttribute('href');
                        }
                    }

                    // Ensure img src is a relative /storage path or absolute http(s)
                    if ($tagName === 'img') {
                        $src = $element->getAttribute('src');
                        if (!preg_match('/^(https?:\/\/|\/storage\/)/i', $src)) {
                            $element->removeAttribute('src');
                        }
                    }

                    // Recurse into children
                    self::sanitizeNode($element);
                }
            }
        }

        // Remove disallowed nodes (replace with text content to preserve text)
        foreach ($toRemove as $el) {
            if ($el->ownerDocument !== null && $el->parentNode !== null) {
                $textNode = $el->ownerDocument->createTextNode($el->textContent);
                $node->replaceChild($textNode, $el);
            }
        }
    }
}
