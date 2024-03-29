// Dependencies
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { config } from 'dotenv'

// Retrieve enviroment data
config()
const proxyUri = process.env.PROXY_URI

// Create RabbitMq Proxy connection
export const proxyClientAdmin = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [ proxyUri ],
    queue: 'admin-backend'
  }
})

export const proxyClientChallenges = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [ proxyUri ],
    queue: 'challenges'
  }
})
