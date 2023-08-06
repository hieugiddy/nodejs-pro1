import express from 'express';
import imageLib from '../libs/imageLib';

type CallbackFunction = () => void;

const fetchCacheIfExist = async (
  req: express.Request,
  res: express.Response,
  next: CallbackFunction
): Promise<void | express.Response> => {
  const { width, height, name } = req.query;

  const outputFilePath = imageLib.getOutputFilePath(
    imageLib.generateFileName(
      name as string,
      width as unknown as number,
      height as unknown as number
    )
  );

  const fileExist = await imageLib.fileExist(outputFilePath);
  console.log(`file ${outputFilePath} exist: ${fileExist}`);

  if (fileExist) {
    res.set('Content-Type', 'image/jpeg');

    imageLib.readFile(outputFilePath).pipe(res);

    return res.status(200);
  }

  next();
};

export default fetchCacheIfExist;
