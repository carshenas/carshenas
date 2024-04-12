// Read more about common image file types and their performance:
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#common_image_file_types

// Image types sorted by better performance:
export enum ImageType {
  WebP = 'image/webp',
  AVIF = 'image/avif',
  APNG = 'image/apng',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  SVG = 'image/svg+xml',
  GIF = 'image/gif'
}

export type ImageExtension = 'jpeg' | 'png' | 'webp' | 'svg' | 'avif' | 'gif' | 'apng'
