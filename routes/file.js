const express = require('express');
const { protect } = require('../middlewares/auth');
const File = require('../models/File');
const Project = require('../models/Project');
const router = express.Router();

// Create a new file
router.post('/files', protect, async (req, res) => {
  const { name, projectId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure the project belongs to the authenticated user
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newFile = new File({
      name,
      project: projectId,
    });

    const savedFile = await newFile.save();

    res.status(201).json(savedFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/filesbyProjectId/:projectId', protect, async (req, res) => {
  try {
    const projectId = req.params.projectId; // Get the projectId from the route parameter
    const files = await File.find({ project: projectId }).populate('project');
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/files/:id', protect, async (req, res) => {
  try {
    const fileId = req.params.id; // Get the fileId from the route parameter
    const file = await File.findById(fileId).populate('project');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Ensure the file's project belongs to the authenticated user
    if (file.project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/files/:id', protect, async (req, res) => {
  try {
    const fileId = req.params.id; // Get the fileId from the route parameter
    const { name, content } = req.body;

    const file = await File.findById(fileId).populate('project');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Ensure the file's project belongs to the authenticated user
    if (file.project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update the file fields
    if (name) file.name = name;
    if (content) file.content = content;

    const updatedFile = await file.save();

    res.status(200).json(updatedFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/deletefilebyFileId/:id', protect, async (req, res) => {
  try {
    const fileId = req.params.id;

    const result = await File.deleteMany({ _id: fileId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No files found with this projectId' });
    }

    res.status(200).json({ message: `${result.deletedCount} file(s) deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
