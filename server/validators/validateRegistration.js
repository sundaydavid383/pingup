const validator = require('validator');

const validateRegistration = (data) => {
  const errors = {};

  const {
    name = '',
    email = '',
    password = '',
    dob = '',
    gender = '',
    occupation = '',
    location = '',
    churchName = '',
    churchRole = '',
    interests = '',
    bio = '',
    prayerRequest = ''
  } = data;

  // 🔒 Required Fields

  // Name
  if (validator.isEmpty(name.trim())) {
    errors.name = 'Name is required';
  } else if (!validator.isLength(name.trim(), { min: 2 })) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email
  if (validator.isEmpty(email.trim())) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email.trim())) {
    errors.email = 'Invalid email format';
  }

if (!password || validator.isEmpty(password)) {
  errors.password = 'Password is required';
} else {
  const passwordErrors = [];

  if (!validator.isLength(password, { min: 6 })) {
    passwordErrors.push('at least 6 characters');
  }
  if (!/[a-zA-Z]/.test(password)) {
    passwordErrors.push('at least one letter');
  }
  if (!/[0-9]/.test(password)) {
    passwordErrors.push('at least one number');
  }

  if (passwordErrors.length > 0) {
    errors.password = 'Password must contain ' + passwordErrors.join(', ');
  }
}

console.log("🔐 Password being validated:", password);

// Date of Birth → Age
if (!dob || typeof dob !== 'string') {
  errors.age = 'Date of Birth is required';
} else {
  const birthDate = new Date(dob);

  // Check for invalid date
  if (isNaN(birthDate.getTime())) {
    errors.age = 'Date of Birth must be a valid date';
  } else {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--; // birthday hasn't happened yet this year
    }

    if (age < 1 ) {
      errors.age = 'You must be at least one year old';
    }
    if ( age > 120) {
      errors.age = 'You must be younger than 120 years old';
    }
  }
}

  // Gender
  if (validator.isEmpty(gender.trim())) {
    errors.gender = 'Gender is required';
  }

  // 📝 Optional Fields (validate if filled)

  if (!validator.isEmpty(occupation.trim()) && !validator.isLength(occupation.trim(), { min: 2 })) {
    errors.occupation = 'Occupation must be at least 2 characters';
  }

  if (!validator.isEmpty(location.trim()) && !validator.isLength(location.trim(), { min: 2 })) {
    errors.location = 'Location must be at least 2 characters';
  }

  if (!validator.isEmpty(churchName.trim()) && !validator.isLength(churchName.trim(), { min: 2 })) {
    errors.churchName = 'Church name must be at least 2 characters';
  }

  if (!validator.isEmpty(churchRole.trim()) && !validator.isLength(churchRole.trim(), { min: 2 })) {
    errors.churchRole = 'Church role must be at least 2 characters';
  }

  if (!validator.isEmpty(bio.trim()) && !validator.isLength(bio.trim(), { min: 10 })) {
    errors.bio = 'Bio must be at least 10 characters';
  }

  if (!validator.isEmpty(interests.trim()) && !validator.isLength(interests.trim(), { min: 3 })) {
    errors.interests = 'Interests must be at least 3 characters';
  }

  if (!validator.isEmpty(prayerRequest.trim()) && !validator.isLength(prayerRequest.trim(), { max: 500 })) {
    errors.prayerRequest = 'Prayer request is too long (max 500 characters)';
  }

  // ✅ Final result
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = validateRegistration;