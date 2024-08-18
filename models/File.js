const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  content: { type: String, required: true }, // JSON string from Excalidraw
});

const File = mongoose.model('File', FileSchema);
module.exports = File;
