import { CookieOptions } from 'express';

export const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 * 7,
  secure: false
  // secure: true --- for ensuring it is only sent over https (for production)
};