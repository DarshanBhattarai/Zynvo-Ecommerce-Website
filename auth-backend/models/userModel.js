const monggoose = require("mongoose");
const userSchema = new monggoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const UserModel = monggoose.model("social-logins", userSchema);

module.exports = UserModel;
