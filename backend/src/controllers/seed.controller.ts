import { Photos } from '@prisma/client';
import axios from 'axios';
import { Request, Response, Router } from 'express';
import prisma from '../utils/prisma';

export const seedRouter = Router();

seedRouter.post('/', async (req: Request, res: Response) => {
  const photos = (await (await axios.get('https://jsonplaceholder.typicode.com/photos')).data) as Photos[];

  for (const photo of photos) {
    
    const photoId = await prisma.photos.findFirst({ where: { id: photo.id } });

    if (!photoId) {
      await prisma.photos.create({ data: { ...photo } });
    }
  }
  res.send('seed is working');
});
