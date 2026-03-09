<?php

namespace App\Services;

/**
 * HtmlSanitizerService — Alias/wrapper untuk HtmlSanitizer.
 *
 * Mengikuti naming convention Request (HtmlSanitizerService)
 * sebagaimana diminta dalam security spec.
 *
 * @see \App\Services\HtmlSanitizer
 */
class HtmlSanitizerService
{
    /**
     * Sanitasi HTML dari TipTap editor sebelum disimpan ke database.
     * Whitelist tag: p, br, strong, em, h2, h3, ul, ol, li, blockquote, code, pre, a, img
     * Force rel="noopener noreferrer" pada link eksternal.
     */
    public static function sanitize(string $html): string
    {
        return HtmlSanitizer::clean($html);
    }
}
