import { Logger } from "../utils/Logger.js";

function logger(req, res, next) {
  const message = {
    reqId: req.reqId,
    userId: req.userId,
  };

  Logger.log({
    message: `Method: ${req.method}, URL: ${req.url}, RequestId: ${req.reqId}, UserId: ${req.userId}`,
    level: "http",
  });

  req.LogData = message;

  next();
}

export default logger;
