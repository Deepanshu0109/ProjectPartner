const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },        // removed unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String },
  semester: { type: Number },
  skills: [{ type: String }],
  interests: [{ type: String }],
  availability: {
    weekday: [{ type: String }],
    weekend: [{ type: String }]
  }
}, { timestamps: true });

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧠 Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
