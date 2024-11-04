import { logger } from "../utils/logger.util"

export const postReq = (req, res) => {
    res.status(200).json('This is post req')
    logger.info('Post method is worker successful')
}

export const getReq = (req, res) => {
    res.status(200).json('This is post req')
}

export const updateReq = (req, res) => {
    res.status(200).json('This is post req')
}

export const deleteReq = (req, res) => {
    res.status(200).json('This is post req')
}