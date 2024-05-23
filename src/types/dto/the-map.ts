// types.ts

export interface LatLng {
  lat: number
  lng: number
}

export interface IconOptions {
  iconUrl: string
  iconSize?: [number, number]
  iconAnchor?: [number, number]
  popupAnchor?: [number, number]
  shadowUrl?: string
  shadowSize?: [number, number]
  shadowAnchor?: [number, number]
}

export class Icon {
  iconUrl: string
  iconSize?: [number, number]
  iconAnchor?: [number, number]
  popupAnchor?: [number, number]
  shadowUrl?: string
  shadowSize?: [number, number]
  shadowAnchor?: [number, number]

  constructor(options: IconOptions) {
    this.iconUrl = options.iconUrl
    this.iconSize = options.iconSize
    this.iconAnchor = options.iconAnchor
    this.popupAnchor = options.popupAnchor
    this.shadowUrl = options.shadowUrl
    this.shadowSize = options.shadowSize
    this.shadowAnchor = options.shadowAnchor
  }

  // Define createIcon method
  createIcon() {
    const img = document.createElement('img')
    img.src = this.iconUrl
    if (this.iconSize) {
      img.style.width = `${this.iconSize[0]}px`
      img.style.height = `${this.iconSize[1]}px`
    }
    return img
  }

  createShadow() {
    if (!this.shadowUrl) return null
    const img = document.createElement('img')
    img.src = this.shadowUrl
    if (this.shadowSize) {
      img.style.width = `${this.shadowSize[0]}px`
      img.style.height = `${this.shadowSize[1]}px`
    }
    return img
  }
}
