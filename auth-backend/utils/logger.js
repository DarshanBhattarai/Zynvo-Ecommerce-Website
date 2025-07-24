import winston from "winston";
import path from "path";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
  )
);

// Create logger
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Console logging (dev-friendly)
    new winston.transports.Console(),

    // Save errors to file
    new winston.transports.File({ filename: path.join("logs", "error.log"), level: "error" }),

    // Save all logs to a combined file
    new winston.transports.File({ filename: path.join("logs", "combined.log") }),
  ],
});

export default logger;
