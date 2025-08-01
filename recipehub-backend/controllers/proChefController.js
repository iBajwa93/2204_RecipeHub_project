const asyncHandler = require('express-async-handler');
const ProChefApp = require('../models/ProChefApplication'); // your ProChefApp model

// Controller to handle pro chef application
const applyForProChef = asyncHandler(async (req, res) => {
  
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: User info missing' });
  }
  
  const userId = req.user.id;

  const existingApp = await ProChefApp.findOne({ user: userId, status: 'pending' });

  if (existingApp) {
    return res.status(400).json({ message: 'You already have a pending application.' });
  }

  const newApp = await ProChefApp.create({
    user: userId,
    status: 'pending',
    submittedAt: Date.now(),
  });

  res.status(201).json({ message: 'Application submitted successfully', application: newApp });
});

module.exports = { applyForProChef };
