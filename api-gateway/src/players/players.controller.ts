// Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete, NotFoundException, BadRequestException, UseInterceptors, UploadedFile, InternalServerErrorException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, firstValueFrom } from 'rxjs'

// Implementations
import { AddPlayerDTO, UpdatePlayerDTO } from './dtos'
import { ValidateParamsPipe } from '../common/pipes'
import { proxyClient } from '../common/helpers'
import { FileInterceptor } from '@nestjs/platform-express'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Controller('api/v1/players')
export class PlayersController {
  // Class properties
  private logger = new Logger(PlayersController.name)
  private clientAdminBackend: ClientProxy

  // Class constructor (Retrieve rabbitmq proxy connection)
  constructor(
    private cloudinaryService: CloudinaryService
  ) {
    this.clientAdminBackend = proxyClient
  }

  @Post()
  addPlayer(@Body() body: AddPlayerDTO) {
    this.logger.log(`Add Player: ${JSON.stringify(body)}`)
    return this.clientAdminBackend.send('add-player', body)
  }  

  @Get()
  async findPlayer(@Query('id') id: string): Promise<Observable<any>> {
    this.logger.log(`Get Players: ${id}`)

    // Verify if register exists
    if (id) {
      // const isRegistered = await this.clientAdminBackend.send('check-player', id).toPromise()
      const isRegistered = await firstValueFrom(this.clientAdminBackend.send('check-player', id))
      if (!isRegistered) {
        throw new NotFoundException(`Jogador de id ${id} não encontrado!`)
      }
    }

    return this.clientAdminBackend.send('get-players', id ? id : '')
  }

  @Delete('/:id')
  async deletePlayer(@Param('id', ValidateParamsPipe) _id: string) {
    this.logger.log(`Delete Player: ${_id}`)

    // Verify if register exists
    if (_id) {
      const isRegistered = await firstValueFrom(this.clientAdminBackend.send('check-player', _id))
      if (!isRegistered) {
        throw new BadRequestException(`Jogador de id ${_id} não encontrado!`)
      }
    }

    return this.clientAdminBackend.send('delete-player', _id)
  }

  @Put('/:id')
  async updatedPlayer(
    @Body() body: UpdatePlayerDTO,
    @Param('id', ValidateParamsPipe) _id: string
  ) {
    this.logger.log(`Update Player: ${JSON.stringify(body)}`)

    // Verify if register exists
    if (_id) {
      const isRegistered = await firstValueFrom(this.clientAdminBackend.send('check-player', _id))
      if (!isRegistered) {
        throw new BadRequestException(`Jogador de id ${_id} não encontrado!`)
      }
    }

    return this.clientAdminBackend.send('update-player', { id: _id, player: body })
  }

  // Upload file feature
  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile (
    @UploadedFile() file: any,
    @Param('id', ValidateParamsPipe) _id: string
  ) {
    this.logger.log(`Upload Player avatar: ${_id}`)

    // Verify if register exists
    if (_id) {
      const isRegistered = await firstValueFrom(this.clientAdminBackend.send('check-player', _id))
      if (!isRegistered) {
        throw new BadRequestException(`Jogador de id ${_id} não encontrado!`)
      }
    }

    // Start file upload
    const uploadResult = await this.cloudinaryService.uploadFileFromBuffer(file, _id)
    if (uploadResult.error) {
      throw new InternalServerErrorException('Ocorreu um erro ao tentar fazer o upload de sua imagem. Tente novamente mais tarde')
    }

    // Update player avatar
    return this.clientAdminBackend.send('update-player', { id: _id, player: { avatar: uploadResult.url }})
  }
}
