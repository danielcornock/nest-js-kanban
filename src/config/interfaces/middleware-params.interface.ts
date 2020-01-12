import { Request, NextFunction } from 'express';
import { IUser } from 'src/auth/model/user';

export interface IReq extends Request {
  user: IUser;
}

export interface INext extends NextFunction {}
