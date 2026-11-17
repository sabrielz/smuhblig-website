/**
 * Ekstraksi ID video YouTube dari berbagai format URL.
 * Mendukung:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - dQw4w9WgXcQ (ID langsung 11 karakter)
 */
export function extractYoutubeId(urlOrId: string | null | undefined): string | null {
    if (!urlOrId || typeof urlOrId !== 'string') {
        return null;
    }

    const trimmed = urlOrId.trim();

    // Jika sudah berupa ID 11 karakter
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }

    // Pola regex YouTube yang mencakup watch?v=, youtu.be/, shorts/, embed/
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})(?:&.*)?/i,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([A-Za-z0-9_-]{11})(?:\?.*)?/i,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})(?:\?.*)?/i,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})(?:\?.*)?/i,
    ];

    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Mendapatkan URL thumbnail YouTube resolusi tinggi (hqdefault).
 */
export function getYoutubeThumbnailUrl(youtubeId: string): string {
    return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * Mendapatkan URL resmi video YouTube.
 */
export function getYoutubeWatchUrl(youtubeId: string): string {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
}
