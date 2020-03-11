import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  displayAs: String
}, {timestamps: true});

// Note: stored password in the database should explicitly be encrypted,
// not plaintext. Ergo, if the password has been modified, we need to
// re-encrypt it.
schema.pre('save', async function(){
  if( this.isModified('password') ){
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// Returns User model associated with passed credentials if valid,
// otherwise throws an exception.
// password is plaintext, so needs hashing for comparison.
schema.statics.authenticate = async function(email, password) {
  try {
    const user = await this.findOne().where('email', email);
    return ( await bcrypt.compare(password, user.password) ) && user;
  } catch(err) {
    throw 'Invalid email or password';
  }
};

// schema.virtual('token');

schema.set('toJSON', {
  // Create a whitelist of non-sensitive fields.
  transform: function(doc, ret, options){
    return {
      id: ret.id,
      email: ret.email,
      displayAs: ret.displayAs,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
      // token: ret.token
    }
  },
  virtuals: true
});

schema.set('toObject', { virtuals: true });

export const User = mongoose.model('User', schema);