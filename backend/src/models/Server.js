const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  ip_address: {
    type: String, required: true, unique: true,
    validate: {
      validator: v => /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(v),
      message: 'Invalid IPv4 address'
    }
  },
  provider: { type: String, required: true, enum: ['aws','digitalocean','vultr','other'] },
  status:   { type: String, required: true, enum: ['active','inactive','maintenance'], default: 'inactive' },
  cpu_cores:{ type: Number, required: true, min: 1, max: 128 },
  ram_mb:   { type: Number, required: true, min: 512, max: 1048576 },
  storage_gb:{ type: Number, required: true, min: 10, max: 1048576 }
}, { timestamps: true });

serverSchema.index({ name: 1, provider: 1 }, { unique: true });
serverSchema.index({ provider: 1, status: 1 });
serverSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Server', serverSchema);
