import winston, { format } from "winston";

const logConfig = {
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    format.prettyPrint()
  ),
  transports: [new winston.transports.Console()],
};

export const Logger = winston.createLogger(logConfig);
