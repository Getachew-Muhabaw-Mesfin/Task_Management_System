const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "Please provide your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    validate: [validator.isEmail, "Please provide a valid email address"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,

});

// Encrypt password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password with a salt factor of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with stored encrypted password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
