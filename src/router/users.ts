import express from 'express'

import { getAllUsers } from '../controllers/users.js'   

import { isAuthenticated } from '../middlewares/index.js'

export default (router: express.Router) => {
    router.get('/users', 
      // Wrap in a function that returns void
      (req, res, next) => {
        isAuthenticated(req, res, next).catch(err => {
          console.error(err);
          res.sendStatus(500);
        });
      },
      // Handler that returns void
      (req, res) => {
        getAllUsers(req, res).catch(err => {
          console.error(err);
          res.sendStatus(500);
        });
      }
    );
  };