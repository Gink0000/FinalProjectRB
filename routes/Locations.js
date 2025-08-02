const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const Location = require('../models/Location');
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later.'
});
router.use(limiter);


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

router.use('/uploads', express.static('uploads'));

router.get('/', async (req, res) => {
  try {
    const { country, provinceOrState } = req.query;

    const filter = { pending: false };
    if (country) filter.country = country;
    if (provinceOrState) filter.provinceOrState = provinceOrState;

    const locations = await Location.find(filter);
    res.json(locations.map(loc => ({ ...loc._doc, id: loc._id })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const loc = await Location.findById(req.params.id);
    loc
      ? res.json({ ...loc._doc, id: loc._id })
      : res.status(404).json({ error: 'Location not found' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.post(
  '/',
  upload.single('image'),
  [
    body('location').notEmpty(),
    body('country').notEmpty(),
    body('provinceOrState').notEmpty(),
    body('longitude').notEmpty(),
    body('latitude').notEmpty(),
    body('description').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { location, country, provinceOrState, description, longitude, latitude } = req.body;

      const newLocation = new Location({
        location,
        country,
        provinceOrState,
        description,
        longitude,
        latitude,
        pending: true,
        imageUrl: req.file ? req.file.filename : null
      });

      const saved = await newLocation.save();
      res.status(201).json({ ...saved._doc, id: saved._id });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to add location' });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    deleted
      ? res.json({ message: 'Location deleted' })
      : res.status(404).json({ error: 'Not found' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.patch('/:id/approve',verifyToken,async(req,res)=>{
  try{
    const user=await User.findById(req.user.userId);
    if(!user?.isAdmin)return res.status(403).end();
    const updated=await Location.findByIdAndUpdate(req.params.id,{pending:false},{new:true});
    if(!updated)return res.status(404).end();
    res.json(updated);
  }catch{
    res.status(400).end();
  }
});

router.delete('/:id/reject',verifyToken,async(req,res)=>{
  try{
    const user=await User.findById(req.user.userId);
    if(!user?.isAdmin)return res.status(403).end();
    const location=await Location.findByIdAndDelete(req.params.id);
    if(!location)return res.status(404).end();
    res.status(204).end();
  }catch{
    res.status(500).end();
  }
});

router.get('/pending/all', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admins only' });
    }
    const pendingLocations = await Location.find({ pending: true });
    res.json(pendingLocations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
