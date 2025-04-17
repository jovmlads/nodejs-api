import express from 'express'
import { login, register } from '../controllers/authentication.js'


// export default (router: express.Router) => {
//     router.post('/auth/register', register)
// }

export default (router: express.Router) => {
    router.post('/auth/register', (req: express.Request, res: express.Response) => {
        register(req, res).catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
    })

    router.post('/auth/login', (req: express.Request, res: express.Response) => {
        login(req, res).catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
    })
}