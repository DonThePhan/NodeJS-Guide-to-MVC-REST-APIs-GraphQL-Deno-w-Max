/**
 * Here we address the fields in "schema.js"
 */

const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = {
  /** 2.1 QUERY Resolver*/
  hello() {
    return {
      text: 'Hello World!',
      views: 1234,
    };
  },

  /** 2.2 MUTATION Resolver*/
  createUser: async function ({ userInput }, req) {
    const existingUser = await User.findOne({ email: userInput.email });

    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }

    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });

    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};
