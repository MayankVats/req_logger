import { Logger } from "../utils/Logger.js";
import httpContext from "express-http-context";

function logger(req, res, next) {
  Logger.log({
    level: "http",
    requestId: httpContext.get("reqId"),
    userId: httpContext.get("userId"),
    message: `Method: ${req.method}, URL: ${req.url}`,
  });

  next();
}

export default logger;
