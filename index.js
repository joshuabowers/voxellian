import sslRedirect from 'heroku-ssl-redirect';
import listEndpoints from 'express-list-endpoints';
import express from 'express';

import helmet from 'helmet';
import cors from 'cors';

import logger from './server/middleware/logger.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { connect } from './server/database.js';

const app = express()
const __dirname = dirname( fileURLToPath( import.meta.url ) )

app.use( sslRedirect() )
app.use( helmet() )
app.use( cors() )
app.use( express.json() )
app.use( express.urlencoded({ extended: true }) )

// TODO: Replace with better logger
app.use( logger );

import { createAuthentication } from './server/authentication.js';

createAuthentication( app );

import api from './server/api/index.js';

app.use('/api', api);

// Serve static files from the React frontend app
app.use(express.static(join(__dirname, '/client/build')))

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '/client/build/index.html'))
})

// Error handler
app.use( (err, req, res, next) => {
  console.error(err.stack)
  if( req.headersSent ){
    return next( err )
  }
  res.status(500).json({ error: err })
} )

const PORT = process.env.PORT || 5000

connect().then(async () => {
  app.listen(PORT, () => {
    console.log(`Express server listening on port ${ PORT }`)
    console.log(listEndpoints(app));
  })
}).catch(async (err) => {
  console.error( err )
})