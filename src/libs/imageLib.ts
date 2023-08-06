import sharp from 'sharp';
import fs from 'fs';
import global from '../config';

const generateFileName = (
  fileName: string,
  width: number,
  height: number
): string => `${fileName}x${width}x${height}`;

const getOutputFilePath = (fileName: string): string =>
  `${global.pathRoot}/processedImages/${fileName}.jpg`;

const getInputFilePath = (fileName: String): string =>
  `${global.pathRoot}/images/${fileName}.jpg`;

const fileExist = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.stat(filePath);
    return true;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    throw error;
  }
};

const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return true;
    }
    return false;
  }
};

const readFile = (filePath: string): fs.ReadStream => {
  return fs.createReadStream(filePath);
};

const convertImage = async (
  fileName: string,
  width: number,
  height: number
): Promise<boolean> => {
  try {
    const image = sharp(getInputFilePath(fileName));
    image.resize(Number(width), Number(height));
    image.toFormat('jpeg');

    await image.toFile(
      getOutputFilePath(generateFileName(fileName, width, height))
    );

    return true;
  } catch (error) {
    return false;
  }
};

export default {
  generateFileName,
  getOutputFilePath,
  getInputFilePath,
  fileExist,
  readFile,
  convertImage,
  deleteFile
};
