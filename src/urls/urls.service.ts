import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(originalUrl: string, userId: number | null) {
    const shortUrl = this.generateShortUrl();

    const url = this.urlRepository.create({
      originalUrl,
      shortUrl,
      userId,
      clicks: 0,
    });

    return await this.urlRepository.save(url);
  }

  async findByShortUrl(shortUrl: string) {
    return await this.urlRepository.findOne({
      where: { shortUrl, deletedAt: null },
    });
  }

  async incrementClicks(shortUrl: string) {
    const url = await this.findByShortUrl(shortUrl);
    if (url) {
      url.clicks += 1;
      await this.urlRepository.save(url);
    }
  }

  async listUrlsByUser(user: number) {
    return await this.urlRepository.find({
      where: { userId: user, deletedAt: null }, // Filtrar só ativas
      order: { clicks: 'DESC' },
    });
  }

  async updateUrl(originalUrl: string, userId: number) {
    const url = await this.urlRepository.findOne({
      where: { originalUrl, userId, deletedAt: null },
    });

    if (!url) {
      throw new Error('URL não encontrada ou não pertence ao usuário.');
    }

    url.shortUrl = this.generateShortUrl();
    await this.urlRepository.save(url);
  }

  async deleteUrl(shortUrl: string, userId: number) {
    const url = await this.urlRepository.findOne({
      where: { shortUrl, userId, deletedAt: null },
    });

    if (!url) {
      throw new Error('URL não encontrada ou não pertence ao usuário.');
    }

    url.deletedAt = new Date();
    await this.urlRepository.save(url);
  }

  private generateShortUrl() {
    return Math.random().toString(36).substring(2, 8); // Gera 6 caracteres aleatórios
  }
}
