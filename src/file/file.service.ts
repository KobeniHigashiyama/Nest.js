import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './fileinterface';

@Injectable()
export class FileService {
  async saveFile(file: Express.Multer.File[],folder: string = 'products') {
    const upload_folder = `${path}/uploads/${folder}`;
    await  ensureDir(upload_folder);
    const response:FileResponse[] = await Promise.all(
      file.map(async file => {
        const originalName  = `${Date.now()}-${file.originalname}`
        await writeFile(`${upload_folder}/${originalName}`,file.buffer)
        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName,
        }
      })
    )
    return response;
  }
}
