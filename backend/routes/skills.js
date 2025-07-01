const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');

// add new skill
router.post('/add-skill', async (req, res) => {
  const { userId, skill } = req.body;

  try {
    console.log('Add skill request received:', { userId, skill });

    if (!userId || !skill) {
      return res.status(400).json({ message: 'User ID and skill are required' });
    }

    // validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ensure skills is an array
    if (!Array.isArray(user.skills)) {
      user.skills = [];
    }

    // prevent duplicate
    if (user.skills.includes(skill)) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    user.skills.push(skill);
    await user.save();

    console.log('Skill added successfully:', user.skills);
    res.status(200).json({ message: 'Skill added successfully', skills: user.skills });
  } catch (error) {
    console.error('Error in /add-skill:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// search skills
router.get('/search', async (req, res) => {
  const { userId, query } = req.query;

  try {
    if (!userId || !query) {
      return res.status(400).json({ message: 'User ID and query are required' });
    }

    // validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const filteredSkills = user.skills.filter((skill) =>
      skill.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json({ skills: filteredSkills });
  } catch (error) {
    console.error('Error in /search:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//delete skill
router.delete('/delete-skill', async (req, res) => {
  const { userId, skill } = req.body;

  try {
    if (!userId || !skill) {
      return res.status(400).json({ message: 'User ID and skill are required' });
    }

    // validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills = user.skills.filter((s) => s !== skill);
    await user.save();

    res.status(200).json({ message: 'Skill deleted successfully', skills: user.skills });
  } catch (error) {
    console.error('Error in /delete-skill:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//all skills for a user
router.get('/', async (req, res) => {
    const { userId } = req.query;
  
    try {
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ skills: user.skills });
    } catch (error) {
      console.error('Error in /skills:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


  
module.exports = router;
