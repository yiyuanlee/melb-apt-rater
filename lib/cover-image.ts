const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

/**
 * Normalize apartment cover paths for next/image.
 * - null / empty → default Unsplash
 * - local paths without leading slash → prefix `/`
 */
export function resolveCoverImage(coverImage: string | null | undefined): string {
  const raw = coverImage?.trim();
  if (!raw) return DEFAULT_COVER;

  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return raw;
  }

  return `/${raw}`;
}
