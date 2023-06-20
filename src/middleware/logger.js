import { Logger } from "../utils/Logger.js";

function logger(req, res, next) {
  const message = {
    reqId: req.reqId,
    userId: req.userId,
  };

  Logger.child({ requestId: req.reqId, userId: req.userId }).log({
    message: `Method: ${req.method}, URL: ${req.url}`,
    level: "http",
  });

  req.LogData = message;

  next();
}

export default logger;
