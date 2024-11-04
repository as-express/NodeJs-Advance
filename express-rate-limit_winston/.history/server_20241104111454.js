import winston from "winston";

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        
    ]
})