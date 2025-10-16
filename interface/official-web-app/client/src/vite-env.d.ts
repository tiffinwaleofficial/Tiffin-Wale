/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
  readonly VITE_CLOUDINARY_API_KEY: string
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string
  readonly API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
