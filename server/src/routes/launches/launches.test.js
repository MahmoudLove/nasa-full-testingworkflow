const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('testing launch api', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });
  describe('testing / Get launches', () => {
    test('it shoiud respond with 200 status code', async () => {
      //it take the app and make listhen on it and make request on it
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe('tes / Post Launches', () => {
    const completeLaunchData = {
      mission: 'Hey test 1',
      rocket: 'Hey test rocket 1',
      target: 'Kepler-1652 b',
      launchDate: 'january 17, 2030',
    };
    const launchDataWithoutDate = {
      mission: 'Hey test 1',
      rocket: 'Hey test rocket 1',
      target: 'Kepler-1652 b',
    };
    const launchDataWithInvalidDate = {
      mission: 'Hey test 1',
      rocket: 'Hey test rocket 1',
      target: 'Kepler-1652 b',
      launchDate: 'Hey',
    };
    test('it shoiud with 200 status code', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test('CAtch in valid properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
    test('catch Inavlid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
