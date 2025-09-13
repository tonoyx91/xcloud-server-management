const Server = require('../models/Server');
const { validateServer, validateServerUpdate } = require('../utils/validation');

exports.list = async (req,res)=>{
  try{
    const { page=1, limit=10, search, provider, status, sortBy='createdAt', sortOrder='desc' } = req.query;
    const filter = {};
    if(search){
      filter.$or = [
        { name: { $regex: search, $options:'i' } },
        { ip_address: { $regex: search, $options:'i' } }
      ];
    }
    if(provider && provider!=='all') filter.provider = provider;
    if(status && status!=='all') filter.status = status;

    const sort = { [sortBy]: sortOrder==='desc' ? -1 : 1 };
    const skip = (parseInt(page)-1) * parseInt(limit);

    const [data, total] = await Promise.all([
      Server.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Server.countDocuments(filter)
    ]);

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  }catch(e){ res.status(500).json({ error:'Server error' }); }
};

exports.get = async (req,res)=>{
  try{
    const s = await Server.findById(req.params.id);
    if(!s) return res.status(404).json({ error:'Not found' });
    res.json(s);
  }catch(e){
    res.status(400).json({ error:'Invalid id' });
  }
};

exports.create = async (req,res)=>{
  const { error, value } = validateServer(req.body);
  if(error) return res.status(400).json({ error:'Validation', details:error.details });
  try{
    const s = await Server.create(value);
    res.status(201).json(s);
  }catch(e){
    if(e.code===11000) return res.status(400).json({ error:'Duplicate', message:'IP or (name+provider) exists' });
    res.status(500).json({ error:'Server error' });
  }
};

exports.update = async (req,res)=>{
  const { error, value } = validateServerUpdate(req.body);
  if(error) return res.status(400).json({ error:'Validation', details:error.details });
  try{
    const s = await Server.findByIdAndUpdate(req.params.id, value, { new:true, runValidators:true });
    if(!s) return res.status(404).json({ error:'Not found' });
    res.json(s);
  }catch(e){
    if(e.code===11000) return res.status(400).json({ error:'Duplicate', message:'IP or (name+provider) exists' });
    res.status(400).json({ error:'Invalid id' });
  }
};

exports.remove = async (req,res)=>{
  try{
    const s = await Server.findByIdAndDelete(req.params.id);
    if(!s) return res.status(404).json({ error:'Not found' });
    res.json({ ok:true });
  }catch(e){ res.status(400).json({ error:'Invalid id' }); }
};

exports.bulkDelete = async (req,res)=>{
  const { ids } = req.body;
  if(!Array.isArray(ids) || ids.length===0) return res.status(400).json({ error:'ids[] required' });
  const result = await Server.deleteMany({ _id: { $in: ids } });
  res.json({ deleted: result.deletedCount });
};
