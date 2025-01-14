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

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Public()
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createUrlDto: CreateUrlDto, @Req() request: Request) {
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_NAME];
    const user = tokenPayload?.sub || null;

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

    await this.urlsService.incrementClicks(shortUrl);
    res.redirect(url.originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/user')
  async list(@TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return await this.urlsService.listUrlsByUser(tokenPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('originalurl')
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
  async delete(
    @Param('shortUrl') shortUrl: string,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return await this.urlsService.deleteUrl(shortUrl, tokenPayload);
  }
}
