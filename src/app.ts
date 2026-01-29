import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from './task.controller';
import cookieParser from 'cookie-parser';
import { authenticate, login, logout } from './auth.controller';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/tasks', getTasks);
app.get('/tasks/:id', getTaskById);
app.post('/tasks', createTask);
app.patch('/tasks/:id', updateTask);
app.delete('/tasks/:id', deleteTask);

app.post('/login', login);
app.post('/logout', logout);
app.get('/auth/tasks', authenticate, getTasks);


export default app;