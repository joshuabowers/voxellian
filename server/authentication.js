import passport from 'passport';
import session from 'cookie-session';
import local from 'passport-local';
import { User } from './models/user.js';

export const SECRET_KEY = process.env.SECRET_KEY_BASE || 'voxellian:subterranean-orangutan'

export function createAuthentication(app) {
  app.use( session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // roughly a day, in milliseconds.
      httpOnly: true,
      sameSite: true,  
    },
    name: 'voxellian:session',
    secret: SECRET_KEY
  }) )  

  passport.use('login', new local.Strategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const user = await User.authenticate(email, password);
      done(null, user, { message: 'Login successful'})
    } catch( err ) {
      if( typeof err === 'string' ){
        done( null, false, { message: err } );
      } else {
        done( err );
      }
    }
  }));
  
  passport.serializeUser( (user, done) => {
    console.log( `Serializing user in session: ${ user.id }` )
    done( null, user.id )
  } )

  passport.deserializeUser( async (id, done) => {
    try {
      const user = await User.findById( id );
      done( null, user )
    } catch( err ) {
      done( `Session invalid: ${ err }` )
    }
  } )

  app.use( passport.initialize() );
  app.use( passport.session() );
}

export function requiresAuthentication( req, res, next ) {
  if(!req.isAuthenticated()){
    next('Not authenticated: login required')
  } else {
    next()
  }
}