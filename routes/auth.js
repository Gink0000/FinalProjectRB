const express = require('express'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 
 
const router = express.Router(); 

const JWT_SECRET = '6f7496M*s(79><E304753rf5';
const { verifyToken } = require('../middleware/auth');

router.post('/signup', async (req, res) => { 
  try { 
    const { username, email, password } = req.body; 
 
    const existingUser = await User.findOne(  { $or: [{ username }, { email }] 
}); 
    if (existingUser)  
       return res.status(409).json( 
          { error: 'Username or email already taken' }); 
 
    const passwordHash = await bcrypt.hash(password, 10); 
    const newUser = new User({ username, email, passwordHash 
}); 
    await newUser.save(); 
 
    res.status(201).json({ error: 'New User Created' })

 
  } catch (err) { 
      console.error(err); 
      res.status(500).json({ error: 'Signup failed' }); 
  } 
});
router.post('/login', async (req, res) => { 
  try { 
    const { username, password } = req.body; 
 
    const user = await User.findOne({ username }); 
    if (!user) return res.status(401).json({ error: 'Invalid credentials' }); 
 
    const isMatch = await bcrypt.compare(password, 
user.passwordHash); 
    if (!isMatch) return res.status(401).json({ error:
        'Invalid credentials' }); 
 const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
  })
  .json({ user }); 

  } catch (err) { 
    console.error(err); 
    res.status(500).json({ error: 'Login failed' }); 
  } 
});   
router.post('/logout', (req, res) => {
res.clearCookie('token', {
httpOnly: true,
secure: process.env.NODE_ENV === 'production',
sameSite: 'Strict'
});
res.json({ message: 'Logged out successfully' });
});

router.post('/save-location/:locationId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 
    const locationId = req.params.locationId;
    if (!user.savedLocations.includes(locationId)) {
      user.savedLocations.push(locationId);
      await user.save();
    }
    res.json({ message: 'Location saved', savedLocations: user.savedLocations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/save-location/:locationId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 
    const locationId = req.params.locationId;
    user.savedLocations = user.savedLocations.filter(id => id.toString() !== locationId);
    await user.save();
    res.json({ message: 'Location removed', savedLocations: user.savedLocations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select('username email createdAt isAdmin savedLocations')
      .populate('savedLocations');
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});




module.exports = router;