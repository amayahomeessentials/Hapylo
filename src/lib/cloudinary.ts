import { v2 as cloudinary } from 'cloudinary'

// Configure once — this module is only ever imported server-side.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary

/**
 * Generate a signed-upload signature so the browser can upload
 * directly to Cloudinary without exposing the API secret.
 */
export function generateUploadSignature(folder: string = 'hapylo/products') {
  const timestamp = Math.round(Date.now() / 1000)
  const paramsToSign = { folder, timestamp }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    timestamp,
    signature,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
  }
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteCloudinaryImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}
