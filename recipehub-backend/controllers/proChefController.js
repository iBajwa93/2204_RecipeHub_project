const asyncHandler = require('express-async-handler');
const ProChefApp = require('../models/ProChefApplication'); // your ProChefApp model
const Revenue = require('../models/Revenue'); // Your Revenue model
const User = require('../models/User');

const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await ProChefApp.find()
    .populate("user", "fullName email isProChef") // populate user with some fields
    .sort({ submittedAt: -1 });

  res.json(applications);
});


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

// Approve Pro Chef Application
const approveApplication = asyncHandler(async (req, res) => {
  const appId = req.params.id;

  const application = await ProChefApp.findById(appId).populate('user');
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  if (application.status !== 'pending') {
    return res.status(400).json({ message: 'Application already processed' });
  }

  application.status = 'approved';
  await application.save();

  // Update user to pro chef
  const user = await User.findById(application.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.isProChef = true;
  await user.save();

  // Check if Revenue entry exists, if not create it
  const existingRevenue = await Revenue.findOne({ user: user._id });
  if (!existingRevenue) {
    await Revenue.create({ user: user._id });
  }

  res.json({ message: 'Application approved, user upgraded to Pro Chef' });
});

// Reject Pro Chef Application
const rejectApplication = asyncHandler(async (req, res) => {
  const appId = req.params.id;

  const application = await ProChefApp.findById(appId);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  if (application.status !== 'pending') {
    return res.status(400).json({ message: 'Application already processed' });
  }

  application.status = 'rejected';
  await application.save();

  res.json({ message: 'Application rejected' });
});

module.exports = {
  applyForProChef,
  approveApplication,
  rejectApplication,
  getAllApplications
};
