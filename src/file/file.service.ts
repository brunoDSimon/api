import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {

    public async upload(file: Express.Multer.File, path) {
        
       return await writeFile(path, file.buffer)
    }
 }
