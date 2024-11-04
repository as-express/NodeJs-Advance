import winston from 'winston';
import path from 'path'


const logDirectory = path.join(__dirname, '../logs');

// Create the logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // File transport for all logs
        new winston.transports.File({ filename: path.join(logDirectory, 'combined.log') }),
        // File transport for error logs
        new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    ],
});

// Ensure the log directory exists
const fs = require('fs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

module.exports = logger;
