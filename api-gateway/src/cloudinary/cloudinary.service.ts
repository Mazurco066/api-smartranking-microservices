// Dependencies
import { createReadStream } from 'streamifier'
import { v2 as cloudinary } from 'cloudinary'
import { Injectable, Logger } from '@nestjs/common'
import { config } from 'dotenv'

// Read enviroment
config()

// Return interfaces
interface UploadResponse {
  url: string
  error: boolean
}

@Injectable()
export class CloudinaryService {

  private logger = new Logger(CloudinaryService.name)

  /**
   * Upload a file to cloudinary CDN
   * @param file - File object
   * @param id - Player id
   * @returns object - containing url as string
   */
  public async uploadFileFromBuffer(file: any, id: string): Promise<UploadResponse> {

    // Move this to another file
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD, 
      api_key: process.env.CLOUDINARY_KEY, 
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true
    })

    // Define file data
    const fileExtension = file.originalname.split('.')[1]
    const fileKey = `${id}.${fileExtension}`

    // Upload file to cloudinary as a buffer
    const uploadPromise = (file: any) => new Promise((resolve, reject) => {
      const cld_upload_stream = cloudinary.uploader.upload_stream({
        folder: 'smartranking_avatar'
      }, (error: any, result: any) => {
        if (result) {
          resolve(result)
        } else {
          reject(error)
        }
      })
      createReadStream(file.buffer).pipe(cld_upload_stream)
    })

    // Starting upload
    try {
      this.logger.log(`Starting upload to cloudinary: ${fileKey}`)
      const result: any = await uploadPromise(file)
      this.logger.log(`Upload completed: ${result.secure_url}`)
      return {
        error: false,
        url: result.secure_url
      }
    } catch (error) {
      this.logger.error(`Upload error: ${JSON.stringify(error.message)}`)
      return {
        error: true,
        url: ''
      }
    }
  }
}
