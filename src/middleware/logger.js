import { Logger } from "../utils/Logger.js";

function logger(req, res, next) {
  const message = {
    reqId: req.reqId,
    userId: req.userId,
  };

  Logger.log({
    level: "http",
    requestId: req.reqId,
    userId: req.userId,
    message: `Method: ${req.method}, URL: ${req.url}`,
  });

  req.LogData = message;

  next();
}

export default logger;
