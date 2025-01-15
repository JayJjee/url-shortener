import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';

import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/dto/payload-token.dto';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/auth/common/auth.constants';
import { Public } from 'src/auth/common/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('urls')
@ApiBearerAuth()
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Public()
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria uma URL encurtada' })
  @ApiBody({
    type: CreateUrlDto,
    description: 'JSON contendo a URL original para encurtar',
    examples: {
      example1: {
        summary: 'Exemplo básico',
        value: {
          originalUrl: 'https://google.com',
        },
      },
    },
  })
  async create(@Body() createUrlDto: CreateUrlDto, @Req() request: Request) {
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_NAME];
    const user = tokenPayload?.sub || null;

    return await this.urlsService.createShortUrl(
      createUrlDto.originalUrl,
      user,
    );
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirecionar para a URL original' })
  @ApiParam({ name: 'shortUrl', description: 'Código da URL encurtada' })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para a URL original',
  })
  @ApiResponse({
    status: 404,
    description: 'URL não encontrada',
  })
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlsService.findByShortUrl(shortUrl);

    if (!url) {
      throw new HttpException('URL não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.urlsService.incrementClicks(shortUrl);
    res.redirect(url.originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar URLs de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs do usuário retornada com sucesso',
    schema: {
      example: [
        { shortUrl: 'w53rir', originalUrl: 'https://google.com', clicks: 10 },
      ],
    },
  })
  async list(@TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return await this.urlsService.listUrlsByUser(tokenPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('originalurl')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar URL original' })
  @ApiBody({
    description: 'Dados para atualizar a URL',
    examples: {
      example1: {
        summary: 'Exemplo de atualização',
        value: {
          shortUrl: 'y8nvu8',
          updateUrl: 'https://fakekekeke.com',
        },
      },
    },
  })
  async updateOriginalUrl(
    @Body('shortUrl') shortUrl: string,
    @Body('updateUrl') updateUrl: string,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return await this.urlsService.updateOriginalUrl(
      shortUrl,
      updateUrl,
      tokenPayload,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':shortUrl')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar URL encurtada' })
  @ApiParam({ name: 'shortUrl', description: 'Código da URL encurtada' })
  @ApiResponse({
    status: 200,
    description: 'URL deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'URL não encontrada',
  })
  async delete(
    @Param('shortUrl') shortUrl: string,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return await this.urlsService.deleteUrl(shortUrl, tokenPayload);
  }
}
