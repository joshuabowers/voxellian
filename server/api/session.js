import express from 'express';
import passport from 'passport';
import { requiresAuthentication } from '../authentication.js';

const router = express.Router();

router.post( '/', 
  passport.authenticate('login'),
  (req, res) => {
    res.json(req.user);
  }
);

// Touch TokenBlacklist. Should use 'jwt' auth.
router.delete( '/', 
  requiresAuthentication,
  async (req, res) => {
    try {
      req.logOut();
      if( req.session ){ req.session = null; }
      res.sendStatus(204);
    } catch( err ){
      res.status(500).json({error: err})
    }
  }
);

export default router;