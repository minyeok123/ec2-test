import { Task as PrismaTask } from '@prisma/client';

export type Task = PrismaTask;

export interface CreateTaskInput {
  title: string;
  description?: string;
  isComplete?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  isComplete?: boolean;
} 

export interface LoginInput {
  email: string;
  password: string;
}
