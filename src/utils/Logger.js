import winston, { format } from "winston";

const logConfig = {
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.json(),
  transports: [new winston.transports.Console()],
};

export const Logger = winston.createLogger(logConfig);
