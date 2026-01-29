import { NextFunction, Request, Response } from 'express';
import { LoginInput } from './types';

export const login = (req: Request<{}, {}, LoginInput>, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: '이메일과 비밀번호가 필요합니다.' });
    return;
  }

  // 테스트를 위한 간단한 인증
  if (email === 'test@example.com' && password === 'password') {
    res
      .status(200)
      .cookie('token', 'simple-auth-token')
      .json({ message: '로그인 성공' });
    return;
  }

  res
    .status(401)
    .json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: '로그아웃 성공' });
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: '토큰이 없습니다.' });
    return;
  }

  if (token === 'simple-auth-token') {
    res.locals = {
      user: {
        id: '1',
        email: 'test@example.com',
      },
    };
    next();
  } else {
    res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
};
