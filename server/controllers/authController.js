const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const validateRegistration = require('../../validators/validateRegistration');

const registerUser = async (req, res) => {
  const { isValid, errors } = validateRegistration(req.body);
  if (!isValid) return res.status(400).json({ errors });

  const { name, email, password, age, gender, occupation, location, churchName, churchRole, interests, bio, prayerRequest } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ errors: { email: 'Email already exists' } });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      occupation,
      location,
      churchName,
      churchRole,
      interests,
      bio,
      prayerRequest
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

module.exports = {registerUser};