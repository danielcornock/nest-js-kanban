import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/boards (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/boards');

    expect(res.status).toBe(403);
    expect(res.unauthorized);
    expect(res.body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
