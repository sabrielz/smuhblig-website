import { describe, it, expect } from 'vitest';
import { extractYoutubeId, getYoutubeThumbnailUrl, getYoutubeWatchUrl } from './youtube';

describe('YouTube Utility Functions', () => {
    const validId = 'dQw4w9WgXcQ';

    it('extracts ID from standard watch URL', () => {
        expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(validId);
        expect(extractYoutubeId('http://youtube.com/watch?v=dQw4w9WgXcQ&feature=share')).toBe(validId);
    });

    it('extracts ID from youtu.be short URL', () => {
        expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe(validId);
        expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ?t=42')).toBe(validId);
    });

    it('extracts ID from shorts URL', () => {
        expect(extractYoutubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe(validId);
    });

    it('extracts ID from embed URL', () => {
        expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(validId);
    });

    it('accepts bare 11-char ID', () => {
        expect(extractYoutubeId(validId)).toBe(validId);
    });

    it('returns null on invalid URL or non-matching string', () => {
        expect(extractYoutubeId('')).toBeNull();
        expect(extractYoutubeId(null)).toBeNull();
        expect(extractYoutubeId(undefined)).toBeNull();
        expect(extractYoutubeId('https://example.com/video')).toBeNull();
        expect(extractYoutubeId('https://youtube.com/watch?v=short')).toBeNull();
    });

    it('formats thumbnail and watch URLs correctly', () => {
        expect(getYoutubeThumbnailUrl(validId)).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
        expect(getYoutubeWatchUrl(validId)).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });
});
