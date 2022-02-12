import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (error, req, res, next) => {

  const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: "This is an error. We will write error handlers later."
  }

  res.status(500).json({ message: defaultError });
};

export default errorHandlerMiddleware
