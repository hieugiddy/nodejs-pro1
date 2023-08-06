import supertest from 'supertest';
import app from '../index';
import imageLib from '../libs/imageLib';

const request = supertest(app);

describe('Images endpoint', () => {
  it('should return a resized image', async () => {
    const response = await request.get(
      '/images?width=200&height=200&name=fjord'
    );

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toBe('image/jpeg');
  });

  it('should return generated resized image', async () => {
    const width = 200;
    const height = 200;
    const name = 'fjord';
    const filePath = imageLib.getOutputFilePath(
      imageLib.generateFileName(name, width, height)
    );

    const deleteFileIfExist = await imageLib.deleteFile(filePath);

    if (deleteFileIfExist) {
      const response = await request.get(
        `/images?width=${width}&height=${height}&name=${name}`
      );

      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toBe('image/jpeg');
    }

    const fileExist = await imageLib.fileExist(filePath);
    expect(fileExist).toBeTrue();
  });

  it('should return a 400 error if the width or height or name parameter is missing', async () => {
    const response = await request.get('/images?width=200&height=200');

    expect(response.status).toEqual(400);
    expect(response.body.toString()).toEqual(
      'Width, height and name parameters are required'
    );
  });

  it('should return a 400 error if the width or height parameter is text', async () => {
    const response = await request.get(
      '/images?width=200&height=text&name=fjord'
    );

    expect(response.status).toEqual(400);
    expect(response.body.toString()).toEqual(
      'Width and height parameters must be numbers'
    );
  });

  it('should return a 400 error if the width or height parameter is less than 1', async () => {
    const response = await request.get(
      '/images?width=200&height=-1&name=fjord'
    );

    expect(response.status).toEqual(400);
    expect(response.body.toString()).toEqual(
      'Width and height parameters must be greater than Zero'
    );
  });

  it('should return a 404 error if the file is not found', async () => {
    const response = await request.get(
      '/images?width=200&height=200&name=ffjord'
    );

    expect(response.status).toEqual(404);
    expect(response.body.toString()).toEqual('File not found');
  });
});
