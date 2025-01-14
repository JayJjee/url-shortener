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
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';

import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/dto/payload-token.dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    const user = createUrlDto.userId ? createUrlDto.userId : null;
    console.log('user', user);

    return await this.urlsService.createShortUrl(
      createUrlDto.originalUrl,
      user,
    );
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlsService.findByShortUrl(shortUrl);

    if (!url) {
      throw new HttpException('URL não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.urlsService.incrementClicks(shortUrl); // Conta o clique
    res.redirect(url.originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/user')
  async list(@TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return await this.urlsService.listUrlsByUser(tokenPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body('originalUrl') originalUrl: string,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return await this.urlsService.updateUrl(originalUrl, tokenPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':shortUrl')
  async delete(
    @Param('shortUrl') shortUrl: string,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return await this.urlsService.deleteUrl(shortUrl, tokenPayload);
  }
}
