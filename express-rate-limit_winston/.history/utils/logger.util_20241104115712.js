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
        new winston.transports.File({ filename: path.join(logDirectory, 'combined.log') }),
        new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    ],
});

const fs = require('fs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
