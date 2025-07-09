const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let phoneSchema = new mongoose.Schema({
  type: {type: String},
  number: {type: String,}
}, {_id: false});

let userSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: [true, "Username is a required field"],
    max: 20,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { 
    type: String, 
    required: [true, "Password is a required field"],
    select: false,
    max: 20
  },
  firstname: { 
    type: String,
    required: [true, "First name is a required field"],
    max: 20,
  },
  lastname: {
     type: String,
      required: [true , "Last name is a required field"],
      max: 20
   },
  email: {
     type: String,
      required: [true, "Email is a required field"],
      max: 30,
      trim: true,
      lowercase: true,
      unique: true 
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true
    },
    phone: {
      type: [phoneSchema], null: true
    }
  }, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Explicitly fetch password if not already loaded
  if (!this.password) {
    const user = await User.findById(this._id).select('+password');
    return await bcrypt.compare(enteredPassword, user.password);
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;  // Exclude password from responses
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);