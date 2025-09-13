const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req,res,next){
  try{
    const token = req.header('Authorization')?.replace('Bearer ','');
    if(!token) return res.status(401).json({ error:'Unauthorized', message:'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if(!user || !user.isActive) return res.status(401).json({ error:'Unauthorized', message:'Invalid user' });
    req.user = user;
    next();
  }catch(e){
    return res.status(401).json({ error:'Unauthorized', message:'Invalid/expired token' });
  }
}

function adminOnly(req,res,next){
  if(req.user?.role !== 'admin') return res.status(403).json({ error:'Forbidden', message:'Admin only' });
  next();
}

module.exports = { auth, adminOnly };
