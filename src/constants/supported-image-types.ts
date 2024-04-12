import { ImageType, type ImageExtension } from '@/types/image'

const IMAGES_TYPES: { type: ImageType; extension: ImageExtension }[] = [
  { type: ImageType.WebP, extension: 'webp' },
  { type: ImageType.PNG, extension: 'png' },
  { type: ImageType.SVG, extension: 'svg' },
  { type: ImageType.JPEG, extension: 'jpeg' }
]

export default IMAGES_TYPES
