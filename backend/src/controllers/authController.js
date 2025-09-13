const jwt = require('jsonwebtoken');
const User = require('../models/User');

function sign(user){
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn:'7d' });
}

exports.login = async (req,res) => {
  try{
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      $or:[ {username: usernameOrEmail}, {email: usernameOrEmail} ],
      isActive: true
    }).select('+password');
    if(!user) return res.status(400).json({ error:'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if(!ok) return res.status(400).json({ error:'Invalid credentials' });
    user.lastLogin = new Date(); await user.save();
    const token = sign(user);
    res.json({ token, user: { id:user.id, username:user.username, role:user.role } });
  }catch(e){ res.status(500).json({ error:'Server error' }); }
};

exports.register = async (req,res) => {
  try{
    const { username, email, password, role } = req.body;
    const user = await User.create({ username, email, password, role: role || 'user' });
    res.status(201).json({ id:user.id, username:user.username, email:user.email, role:user.role });
  }catch(e){
    if(e.code === 11000) return res.status(400).json({ error:'Duplicate', message:'Username or email exists' });
    res.status(500).json({ error:'Server error' });
  }
};

exports.me = (req,res) => res.json({ user: req.user });
