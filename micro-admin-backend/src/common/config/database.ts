// Dependencies
import { config } from 'dotenv'
config()

// Mongodb URI
const uri = process.env.MONGO_URI || `${process.env.MONGODB_PROTOCOL}${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_ADDRESS}${(process.env.MONGODB_PROTOCOL.endsWith('srv://') ? '' : ':' + process.env.MONGODB_PORT)}`

export default uri
