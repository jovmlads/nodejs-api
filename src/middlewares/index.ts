import express from 'express'
import _ from 'lodash'

import { getUsersBySessionToken } from '../db/users.js'

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const sessionToken = req.cookies['MJ-AUTH']

        if (!sessionToken) {
            return res.sendStatus(403)
        }

        const existingUser = await getUsersBySessionToken(sessionToken)

        if (!existingUser) {
            return res.sendStatus(403)
        }

        _.merge(req, { identity: existingUser })

        return next()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}