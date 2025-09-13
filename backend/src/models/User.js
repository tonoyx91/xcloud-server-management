const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role:     { type: String, enum: ['admin','user'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin:{ type: Date }
}, { timestamps: true });

userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(pwd) {
  return bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model('User', userSchema);
