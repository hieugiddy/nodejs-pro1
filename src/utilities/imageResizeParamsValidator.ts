import express from 'express';

type CallbackFunction = () => void;

const validateParams = (
  req: express.Request,
  res: express.Response,
  next: CallbackFunction
): void | express.Response => {
  const { width, height, name } = req.query;

  res.set('Content-Type', 'image/jpeg');

  if (!width || !height || !name) {
    return res
      .status(400)
      .send('Width, height and name parameters are required');
  }

  if (isNaN(Number(width)) || isNaN(Number(height))) {
    return res.status(400).send('Width and height parameters must be numbers');
  }

  if (Number(width) <= 0 || Number(height) <= 0) {
    return res
      .status(400)
      .send('Width and height parameters must be greater than Zero');
  }

  next();
};

export default validateParams;
