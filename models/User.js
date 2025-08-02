const mongoose = require('mongoose'); 
const userSchema = new mongoose.Schema({ 
username: { type: String, required: true, unique: true }, 
email: { type: String, required: true, unique: true }, 
passwordHash: { type: String, required: true }, 
savedLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
isAdmin: { type: Boolean, default: false } 
}, { timestamps: true }); 
const User = mongoose.model('User', userSchema); 
module.exports = User; 