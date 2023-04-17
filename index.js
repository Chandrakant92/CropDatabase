const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json())

// Connect to MongoDB database
mongoose.connect('mongodb+srv://agroinformatics:agroinformatics@agroinformatics.rmo37ed.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));

// Define a schema for the image data
const ImageSchema = new mongoose.Schema({
  photoUri: {
    type: String,
    required: true,
    maxlength: 100000000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define a model for the image data
const Image = mongoose.model('Image', ImageSchema);

// Parse JSON requests
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Handle POST requests to /save-photo
app.post('/image', async (req, res) => {
  try {
    // Extract the photoUri from the request body
    const { photoUri } = req.body;

    if (!photoUri || typeof photoUri !== 'string') {
      throw new Error('Invalid photo URI');
    }

    // Create a new image document using the extracted data
    const image = new Image({ photoUri });

    // Save the image document to the database
    await image.save();

    // Send a success response
    res.status(200).json({ message: 'Image saved successfully' });
  } catch (error) {
    // Send an error response
    
    console.error(error);
    res.status(500).json({ message: 'Error saving image' });
  }
});

// Serve the React Native client-side code
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
