import { Response } from "express";

// type response sructure
export interface ResponseStructure<T> {
  meta: {
    statusCode: number;
    message: string;
  };
  data: T;
}

// response
export class ResponseResult {
  // response type success
  static success<T>(
    data: T,
    res: Response<ResponseStructure<T>>,
    statusCode?: number,
    message?: string,
  ) {
    return res.status(statusCode || 200).json({
      meta: {
        statusCode: statusCode || 200,
        message: message || "success",
      },
      data: data,
    });
  }

  static successNoContent(
    data: null,
    res: Response<ResponseStructure<null>>,
    message?: string,
  ) {
    return res.status(204).json({
      meta: {
        statusCode: 204,
        message: message || "success",
      },
      data: data,
    });
  }
  // error
  static error(
    res: Response<ResponseStructure<null>>,
    statusCode?: number,
    message?: string,
  ) {
    return res.status(statusCode || 500).json({
      meta: {
        statusCode: statusCode || 500,
        message: message || "error",
      },
      data: null,
    });
  }

  // not found
  static notFound(res: Response<ResponseStructure<null>>, message?: string) {
    return res.status(404).json({
      meta: {
        statusCode: 404,
        message: message || "Resource not found",
      },
      data: null,
    });
  }

  // authentication error
  static unauthorized(
    res: Response<ResponseStructure<null>>,
    message?: string,
  ) {
    return res.status(401).json({
      meta: {
        statusCode: 401,
        message: message || "Unauthorized",
      },
      data: null,
    });
  }

  // forbidden error
  static forbidden(res: Response<ResponseStructure<null>>, message?: string) {
    return res.status(403).json({
      meta: {
        statusCode: 403,
        message: message || "Forbidden",
      },
      data: null,
    });
  }
}
