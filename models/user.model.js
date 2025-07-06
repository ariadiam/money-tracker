const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    phone: {
      type: [phoneSchema], null: true}
    }
  , { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);