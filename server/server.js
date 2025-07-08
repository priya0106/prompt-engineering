import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-prompt', async (req, res) => {
  const { userInput, desiredOutput } = req.body;

  const metaPrompt = `
You are a prompt engineer. Based on the input: "${userInput}" and expected output: "${desiredOutput}", generate 3 clear, effective prompts for an AI system.
`;

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // You can replace with another Together model
        messages: [{ role: 'user', content: metaPrompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generated = response.data.choices[0].message.content;
    const prompts = generated.split('\n').filter(p => p.trim());
    res.json({ prompts });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Prompt generation failed' });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
