import * as dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

export const environment: string = process.env.NODE_ENV || 'development';

const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);

export const database = (env: string): string => {
  return process.env.DB_LOCAL_URI;
};

export const jwtSecret: string = process.env.JWT_SECRET;

export const jwtExpires: string = process.env.JWT_EXPIRES;
