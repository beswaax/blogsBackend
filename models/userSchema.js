const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
    require: true,
  },
  name: String,
  passwordHash: {
    type: String,
    minlength: 8,
    required: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", //The ref option is what tells Mongoose which model to use during populatio
    },
  ],
});

userSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  },
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
