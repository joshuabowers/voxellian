import { connect } from '../database.js';
import { User } from '../models/user.js';

const attributes = {
  email: process.env.ADMIN_EMAIL || 'test@example.com',
  password: process.env.ADMIN_PASSWORD || 'Test1234!',
  displayAs: process.env.ADMIN_USERNAME || 'Admin'
}

connect().then( async (connection) => {
  try {
    console.log('Attempting to find admin user');
    const user = await User.findOne().where('email', attributes.email);
    if( user ){
      console.info( 'Found preexisting user:', user );
    } else {
      console.log( 'No user found; creating' );
      User.create(attributes);
    }  
  } catch( err ){
    console.error( err );
  } finally {
    connection.disconnect();
  }
});