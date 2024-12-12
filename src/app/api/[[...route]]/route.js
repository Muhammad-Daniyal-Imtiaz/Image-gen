import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api');

// List of allowed models
const allowedModels = [
  "stabilityai/stable-diffusion-3.5-large",
  "black-forest-labs/FLUX.1-dev",
  "black-forest-labs/FLUX.1-schnell",
  "ginipick/flux-lora-eric-cat",
  "seawolf2357/flux-lora-car-rolls-royce",
  "XLabs-AI/flux-RealismLora",
  "strangerzonehf/Flux-Midjourney-Mix2-LoRA",
  "InstantX/FLUX.1-dev-IP-Adapter",
  "tryonlabs/FLUX.1-dev-LoRA-Outfit-Generator",
];

// Define a POST route for querying the Hugging Face API
app.post('/generate-image', async (c) => {
  const data = await c.req.json(); // Parse the incoming request body
  const { model, prompt } = data; // Destructure the model and prompt

  // Validate the selected model
  if (!allowedModels.includes(model)) {
    return c.json({ error: 'Invalid model selected' }, 400);
  }

  try {
    // Make a request to Hugging Face API to generate the image
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`, // Use the selected model
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN}`,
                    "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }), // Send only the prompt
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text(); // Read the error response
      throw new Error(`Error generating image: ${errorText}`);
    }

    // Get the image array buffer from the response
    const arrayBuffer = await response.arrayBuffer(); // Use arrayBuffer() to get the raw binary data

    // Convert the array buffer to a Buffer
    const imageBuffer = Buffer.from(arrayBuffer); // Convert array buffer to Node.js Buffer

    // Convert the buffer to a Base64 string
    const base64data = imageBuffer.toString('base64'); // Convert buffer to Base64
    const base64Image = `data:image/png;base64,${base64data}`; // Prepend the data URL prefix

    return c.json({ imageUrl: base64Image }); // Return the Base64 image URL
  } catch (error) {
    console.error('Error generating image:', error);
    return c.json({ error: error.message || 'Failed to generate image' }, 500);
  }
});

// Handle POST requests
export const POST = handle(app);
