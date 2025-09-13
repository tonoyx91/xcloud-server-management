require('dotenv').config();
const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const morgan    = require('morgan');
const { connectDB } = require('./config/database');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 300 }));

app.get('/api/health', (req,res)=> res.json({ status:'ok', time:new Date().toISOString() }));

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/servers', require('./routes/servers'));

app.use((req,res)=> res.status(404).json({ error:'Not found' }));

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGODB_URI).then(()=>{
  app.listen(PORT, ()=> {
    console.log(`🚀 API on http://localhost:${PORT}`);
  });
});
