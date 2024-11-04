import { logger } from "../utils/logger.util"

export const postReq = (req, res) => {
    res.status(200).json('This is post req')
    logger.info('Post method is worker successful')
}

export const getReq = (req, res) => {
    res.status(200).json('This is post req')
    logger.info('get method is worker successful')

}

export const updateReq = (req, res) => {
    res.status(200).json({message: 'This is post req'})
    logger.info('Update method is worker successful')
}

export const deleteReq = (req, res) => {
    res.status(200).json({message: 'This is post req'})
    logger.info('Delete method is worker successful')
}

export const errorReq = (req, res) => {
    res.status(500).json({message: 'Error in Server'})
    logger.error('The Post error req is failed')
}