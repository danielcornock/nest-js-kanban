import { Request, Response, NextFunction } from 'express';
import { IUser } from 'src/auth/model/user';
import { Document } from 'mongoose';

export interface IReq extends Request {
  user: IUser;
}

export interface IRes<D> {
  [key: string]: D;
}

export interface INext extends NextFunction {}
