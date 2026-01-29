import { Request, Response } from 'express';
import prisma from './lib/prisma';
import { CreateTaskInput, UpdateTaskInput } from './types';

export const getTasks = async (req: Request, res: Response) => {
  const count = req.query.count ? Number(req.query.count) : undefined;
  const sortOrder = req.query.sort === 'oldest' ? 'asc' : 'desc';

  const tasks = await prisma.task.findMany({
    take: count,
    orderBy: {
      createdAt: sortOrder,
    },
  });

  res.send(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
  });

  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
};

export const createTask = async (
  req: Request<{}, {}, CreateTaskInput>,
  res: Response
) => {
  const newTask = await prisma.task.create({
    data: req.body,
  });
  res.send(newTask);
};

export const updateTask = async (
  req: Request<{ id: string }, {}, UpdateTaskInput>,
  res: Response
) => {
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.send(task);
  } catch (error) {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
};
