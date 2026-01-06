import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const AdvertStorage = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = join(process.cwd(), 'uploads', 'advert');

      // folder bo‘lmasa — yaratib qo‘yamiz
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      callback(null, uploadPath);
    },

    filename: (req, file, callback) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      callback(null, `${unique}.${ext}`);
    },
  }),
};
