import express from 'express';
import validateParams from './utilities/imageResizeParamsValidator';
import fetchCacheIfExist from './utilities/imageCacheMiddleware';
import imageLib from './libs/imageLib';

const app = express();
const port = 3000;

app.get('/health_check', async (req, res) => {
  res.send('Application running ok');
});

app.get(
  '/images',
  [validateParams, fetchCacheIfExist],
  async (req: express.Request, res: express.Response) => {
    const { width, height, name } = req.query;

    const inputFilePath = imageLib.getInputFilePath(name as string);
    console.log(`Generated input file name ${inputFilePath}`);

    const fileExist = await imageLib.fileExist(inputFilePath);
    console.log(`Input file exist: ${fileExist}`);

    res.set('Content-Type', 'image/jpeg');

    if (!fileExist) {
      return res.status(404).send('File not found');
    }

    const convertResponse = await imageLib.convertImage(
      name as string,
      width as unknown as number,
      height as unknown as number
    );

    console.log(`Convert Images response ${convertResponse}`);

    if (!convertResponse) {
      return res.status(500).send('Failed to convert image');
    }

    const file = imageLib.readFile(
      imageLib.getOutputFilePath(
        imageLib.generateFileName(
          name as string,
          width as unknown as number,
          height as unknown as number
        )
      )
    );

    file.pipe(res);
  }
);

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

export default app;
