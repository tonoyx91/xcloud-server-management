require('dotenv').config();
const { connectDB } = require('./config/database');
const User = require('./models/User');

(async ()=>{
  await connectDB(process.env.MONGODB_URI);
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  let user = await User.findOne({ username: ADMIN_USERNAME });
  if(!user){
    user = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });
    console.log('✅ Admin created:', user.username);
  } else {
    console.log('ℹ️ Admin already exists');
  }
  process.exit(0);
})();
