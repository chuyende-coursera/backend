import HttpStatus from "http-status-codes";
import logger from "../utils/logger";
import PrettyError from 'pretty-error';
import buildError from '../utils/buildError';

export default function notFound(req, res) {
  res.status(202).json({
    error: {
      code: HttpStatus.NOT_FOUND,
      // message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      message: "Yêu cầu bạn gửi không tồn tại"
    }
  });
}

export function methodNotAllowed(req, res) {
  // res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
  res.status(202).json({
    success: false,
    error: {
      code: HttpStatus.METHOD_NOT_ALLOWED,
      // message: HttpStatus.getStatusText(HttpStatus.METHOD_NOT_ALLOWED)
      message: "Yêu cầu bạn gửi không được hỗ trợ"
    }
  });
}

export function bodyParser(err, req, res, next) {
  logger.error(err.message);

  // res.status(err.status).json({
  res.status(202).json({
    success: false,
    error: {
      code: err.status,
      // message: HttpStatus.getStatusText(err.status)
      message: "Yêu cầu bạn gửi không được hỗ trợ"
    }
  });
}

const pe = new PrettyError();

pe.skipNodeFiles();
pe.skipPackage("express");
pe.withoutColors();

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export function genericErrorHandler(err, req, res, next) {
  process.stderr.write(pe.render(err));
  logger.error(pe.render(err).toString());
  const error = buildError(err);

  console.log("error: ", error);
  if (err.name === "UnauthorizedError") {
    res.status(202).json({
      error,
      message: "Token hết hạn",
      success: false,
      status: 401,
      code: 401
    });
  } else
    res.status(/* error.code ||  */ 202).json({
      error,
      success: false
    });
}
