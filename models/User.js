const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  loginDate: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model("logUser", UserSchema);
// User.createIndexes();
module.exports = User;
