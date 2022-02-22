import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
    const defaultError = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
    }  
    
    res.status(500).json({ message: defaultError });
  
};

export default errorHandlerMiddleware