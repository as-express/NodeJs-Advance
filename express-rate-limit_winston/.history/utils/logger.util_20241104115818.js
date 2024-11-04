import winston from 'winston';
import path from 'path'

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: path.join('combined.log') }),
        new winston.transports.File({ filename: path.join('error.log'), level: 'error' }),
    ],
});
