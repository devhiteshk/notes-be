const express = require('express');
const axios = require('axios');
const { protect } = require('../middlewares/auth');
const Groq = require("groq-sdk");


const router = express.Router();

const prompt = `You are a chat assistant for an Excalidraw application. Your task is to respond to user queries with JSON representing Excalidraw elements.

1. **Response Format**: Provide the response in JSON format for Excalidraw elements. The JSON response should be structured as follows:
   - **For valid requests**: 
     \`\`\`json
     {
       "elements": [
         { "type": "rectangle", "x": 100, "y": 100, "width": 200, "height": 100, "backgroundColor": "#FF0000" },
         { "type": "text", "x": 50, "y": 50, "text": "Hello, World!", "fontSize": 20, "color": "#000000" },
         { "type": "ellipse", "x": 150, "y": 150, "width": 200, "height": 100, "backgroundColor": "#00FF00" },
         { "type": "diamond", "x": 300, "y": 200, "width": 100, "height": 100, "backgroundColor": "#0000FF" },
         { "type": "freeDraw", "points": [ [0, 0], [100, 100], [200, 100], [300, 200] ], "color": "#FF00FF", "strokeWidth": 2 }
         { "type": "line", "x": 50, "y": 300, "width": 200, "height": 0, "backgroundColor": "#FFFF00" },
       ],
       "message": "Created your requested query on canvas"
     }
     \`\`\`
   - **For invalid requests**: 
     \`\`\`json
     {
       "elements": {},
       "message": "Sorry, this thing can't be done on canvas, please send canvas realated request like drawing a circle, writing a text etc."
     }
     \`\`\`

2. **Important** - Only give the \`elements\` array and \`message\` in the response as {elements: [...{}], message: "message string"}, nothing else, also dont add any strings before or after response JSON

User query: \n`;


router.post('/chat', protect, async (req, res) => {
    const userMessage = req.body.message;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        async function getGroqChatCompletion() {
            return groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt + userMessage + "using excalidraw elements",
                    },
                ],
                model: "llama3-8b-8192",
            });
        }

        const chatCompletion = await getGroqChatCompletion();

        const botMessage = chatCompletion.choices[0]?.message?.content || ""
        res.json({ response: botMessage });

    } catch (error) {
        // Log the full error for debugging
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);

        // Send a more detailed error message if available
        const errorMessage = error.response && error.response.data ? error.response.data : 'Failed to communicate with ChatBot';
        res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;
