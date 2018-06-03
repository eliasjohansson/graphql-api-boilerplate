import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  username: {
    type: String,
    required: true,
    maxlength: 128,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
    select: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);

