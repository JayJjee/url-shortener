import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { Response } from 'express';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    const { originalUrl, userId } = createUrlDto;
    return await this.urlsService.createShortUrl(originalUrl, userId);
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
}
