require('winston-daily-rotate-file');
require('winston-mongodb')
const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY  = "Money-Tracker app logs";

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "./logs/rotate-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  maxFiles: "7d",
  level: "error"
});

const logger = createLogger({
  format: combine(
    label({label: CATEGORY}),
    timestamp({format:"DD-MM-YYYY HH:mm:sss"}),
    format.json()
  ),
  transports: [
    new transports.Console(),
    fileRotateTransport,
    new transports.File(
      {
        filename:"logs/example.log"
      }
    ),
    new transports.File(
      {
        level: "warn",
        filename: 'logs/warn.log' 
      }
    ),
    new transports.File(
      {
        level: "info",
        filename: 'logs/info.log'
      }
    ),
    new transports.MongoDB({
      level: "warn",
      db: process.env.MONGODB_URI,
      collection: 'server_logs',
      format: format.combine(
          format.timestamp(),
          format.json()
      )
    })
  ]
})

module.exports = logger;