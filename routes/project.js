const express = require('express');
const { protect } = require('../middlewares/auth');
const Project = require('../models/Project');
const File = require('../models/File');
const router = express.Router();

// Create a new project
router.post('/projects', protect, async (req, res) => {
  const { name } = req.body;

  try {
    const newProject = new Project({
      name,
      user: req.user.id,
    });

    const savedProject = await newProject.save();

    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/projects', protect, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/deleteFolderById/:id', protect, async (req, res) => {
  try {
    const folderId = req.params.id;
    const result = await Project.deleteMany({ _id: folderId });
    res.status(200).json({ message: `${result.deletedCount} file(s) deleted successfully` });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
