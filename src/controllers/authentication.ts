import express from 'express'
import { getUsersByEmail, createUser } from '../db/users.js'
import { authentication, random } from '../helpers/index.js'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.sendStatus(400)
        }

        const user = await getUsersByEmail(email).select('+authentication.salt +authentication.password')

        if (!user) {
            return res.sendStatus(400)
        }

        // login user without knowing the password using hash comparison
        if (!user.authentication) {
            return res.sendStatus(400)
        }
        

        if (!user.authentication.salt) {
            return res.sendStatus(400)
        }
        
        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403)
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie('MJ-AUTH', user.authentication.sessionToken, {
            domain: 'locahost',
            path: '/'
        })

        return res.status(200).json(user)

    }   catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.sendStatus(400)
        }

        const existingUser = await getUsersByEmail(email)
        if (existingUser) {
            return res.sendStatus(400)
        }

        // create authentication
        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}