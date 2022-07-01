import { Request, Response, Router } from 'express';
import { isAdmin } from '../middlewares/isAdmin.middleware';
import prisma from '../utils/prisma';

export const photosRouter = Router();

photosRouter.get('/album', async (req: Request, res: Response) => {
  const query = req.query as any;

  const count = await prisma.photos.findMany({
    distinct: ['albumId'],
    select: {
      albumId: true,
    },
  });

  const album = await prisma.photos.findMany({
    distinct: ['albumId'],
    select: {
      albumId: true,
    },
    skip: Math.floor(query.currentPage * 10 - 10),
    take: 10,
    orderBy: { albumId: 'asc' },
  });

  res.status(200).json({ data: album, total: count.length });
});

photosRouter.get('/', async (req: Request, res: Response) => {
  const query = req.query as any;

  const count = await prisma.photos.count({
    where: {
      albumId: Number(query.albumId),
      title: { contains: query.title },
    },
  });

  const photos = await prisma.photos.findMany({
    where: {
      albumId: Number(query.albumId),
      title: { contains: query.title },
    },
    skip: Math.floor(query.currentPage * 9 - 9),
    take: 9,
  });

  res.status(200).json({ data: photos, total: count });
});

photosRouter.post('/', isAdmin, async (req: Request, res: Response) => {
  const body = req.body;

  const photo = await prisma.photos.create({
    data: { albumId: Number(body.albumId), thumbnailUrl: body.thumbnailUrl, title: body.title, url: body.url },
  });

  res.status(201).json({ data: photo });
});

photosRouter.put('/', isAdmin, async (req: Request, res: Response) => {
  const body = req.body;

  const photo = await prisma.photos.update({ where: { id: body.id }, data: { title: body.title } });

  res.status(201).json({ data: photo });
});

photosRouter.post('/move', isAdmin, async (req: Request, res: Response) => {
  const body = req.body;

  const photo = await prisma.photos.update({ where: { id: body.id }, data: { albumId: Number(body.albumId) } });

  res.status(201).json({ data: photo });
});

photosRouter.delete('/', isAdmin, async (req: Request, res: Response) => {
  const body = req.body;

  const photo = await prisma.photos.delete({ where: { id: body.id } });

  res.status(201).json({ data: photo });
});
