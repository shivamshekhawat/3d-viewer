export interface Vector3Position {
  x: number
  y: number
  z: number
}

export interface SavedView {
  id: string
  name: string
  position?: Vector3Position
  target?: Vector3Position
  createdAt: string
}

export interface Model {
  id: string
  name: string
  fileUrl: string
  thumbnail?: string
  savedViews: SavedView[]
  createdAt: string
}

