import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const port = process.env.PORT || 3000;

// OpenAI API key authentication
const openAIConfiguration = new Configuration({
  apiKey: "YOUR_API_KEY"
});
const openAI = new OpenAIApi(openAIConfiguration);

app.use(express.json());
app.use(cors());

app.post('/openai/generateimage', async (req, res) => {
  const { prompt, size } = req.body;

  const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

  try {
    const response = await openAI.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });

    const imageUrl = response.data.data[0].url;

    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
