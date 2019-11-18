import winston from 'winston';

// Imports the Google Cloud client library for Winston
// tslint:disable-next-line:no-var-requires
const { LoggingWinston } = require('@google-cloud/logging-winston');

const gcpLogger = (id: string) => {
  return new LoggingWinston({
    prefix: id
  });
};

const loggerCreator = (id: string) => {

  const log = winston.createLogger({
    level: 'info',
    defaultMeta: { logRoot: id },
    levels: winston.config.syslog.levels,
    transports: []
  });
  if (process.env.NODE_ENV !== 'production') {
    log.add(new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  } else {
    log.add(gcpLogger(id));
  }

  return log;
};

const logger = loggerCreator('general');

const stream = {
  write: (message: any) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
};

export { logger, stream };
