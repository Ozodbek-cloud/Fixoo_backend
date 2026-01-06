import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, existsSync, ReadStream, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService) { }

    private readonly basePath = join(__dirname, '..', '..', '..', 'uploads');

    private readonly folderMap = {
        image: 'images',
        video: 'videos',
        text: 'texts',
        pdf: 'docs',
        other: 'others',
    };

    async getFileStream(fileType: string, filename: string): Promise<ReadStream> {
        const folder = this.folderMap[fileType];
        if (!folder) {
            throw new BadRequestException('Invalid fileType');
        }

        const filePath = join(this.basePath, folder, filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('File not found');
        }

        return createReadStream(filePath);
    }

    async getFiles(id: string) {
        let files = await this.prisma.files.findMany({
            where: { userId: id }
        })

        return {
            success: true,
            data: files
        }
    }

    async createFiles(userId: string, fileType: string, fileUrl: string) {
        const created = await this.prisma.files.create({
            data: {
                fileType,
                fileUrl,
                userId,
            },
        });

        return {
            id: created.id,
            fileType: created.fileType,
            fileUrl: created.fileUrl,
        };
    }

  async deleteFileById(userId: string, fileId: string) {
    const file = await this.prisma.files.findFirst({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.userId !== userId) {
      throw new ForbiddenException('You cannot delete this file');
    }

    const filePath = join(this.basePath, file.fileType + 's', file.fileUrl);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    await this.prisma.files.delete({
      where: { id: fileId },
    });

    return { success: true, message: 'The file has been deleted' };
  }
}
