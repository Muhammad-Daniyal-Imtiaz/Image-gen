'use client';
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Zap, ImageIcon, Moon, Sun } from 'lucide-react';
import supabase from '../Supabase/config';

// Models List
const models = [
  { id: "stabilityai/stable-diffusion-3.5-large", name: "Stable Diffusion 3.5" },
  { id: "black-forest-labs/FLUX.1-dev", name: "FLUX 1" },
  { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX 1 Schnell" },
  { id: "ginipick/flux-lora-eric-cat", name: "FLUX Lora Eric Cat" },
  { id: "seawolf2357/flux-lora-car-rolls-royce", name: "FLUX Lora Car Rolls Royce" },
  { id: "XLabs-AI/flux-RealismLora", name: "FLUX Realism Lora" },
  { id: "strangerzonehf/Flux-Midjourney-Mix2-LoRA", name: "Flux Midjourney Mix2 LoRA" },
  { id: "tryonlabs/FLUX.1-dev-LoRA-Outfit-Generator", name: "FLUX Outfit Generator" },
];

const themes = [
  { name: 'Neon Noir', value: 'theme-neon-noir' },
  { name: 'Biotech Fusion', value: 'theme-biotech-fusion' },
  { name: 'Quantum Haze', value: 'theme-quantum-haze' },
  { name: 'Cyber Samurai', value: 'theme-cyber-samurai' },
  { name: 'Synthwave Dreamscape', value: 'theme-synthwave-dreamscape' },
];

export default function ImageGenerator() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("512x512");
  const [currentTheme, setCurrentTheme] = useState('theme-neon-noir');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = currentTheme;
    fetchImagesFromSupabase();
  }, [currentTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleGenerate = async () => {
    if (!selectedModel || !prompt) {
      alert("Please select a model and enter a prompt!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel, prompt, resolution }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImages([{ imageUrl: data.imageUrl, prompt }, ...generatedImages]);
        
        // Directly upload the image after generation
        await handleImageUpload(data.imageUrl);
      } else {
        console.error("Image generation failed:", data.error);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (imageUrl, prompt) => {
    if (!imageUrl) {
      alert("No image selected for upload!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", imageUrl);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
      if (data.secure_url) {
        await saveImageToSupabase(data.secure_url, prompt);
        alert("Image uploaded successfully!");
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
    const saveImageToSupabase = async (imageUrl, description) => {
    try {
      const { error } = await supabase
        .from("images")
        .insert([{ image_url: imageUrl, description, uploaded: true }]);

      if (error) {
        console.error("Error saving to Supabase:", error);
      }
    } catch (error) {
      console.error("Error with Supabase:", error);
    }
  };

  const fetchImagesFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("images")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) {
        console.error("Error fetching images:", error);
        return;
      }

      setGeneratedImages(data.map((item) => ({ imageUrl: item.image_url, prompt: item.description })));
    } catch (error) {
      console.error("Error fetching from Supabase:", error);
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image-${Date.now()}.png`; // Fixed download file name
    link.click();
  };

  return (
    <div className={`min-h-screen ${currentTheme} ${isDarkMode ? 'dark' : ''} transition-all duration-500`}>
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 py-8">
          <h1 className="text-6xl font-bold neon-text text-center glitch cyber-text animate-pulse" data-text="NeoGen: AI Image Synthesizer">
            NeoGen: AI Image Synthesizer
          </h1>
          <div className="flex justify-center items-center mt-4">
            <Select onValueChange={(value) => setCurrentTheme(value)} className="w-[200px]">
              <SelectTrigger className="neon-border hover:scale-105">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={toggleDarkMode} variant="outline" size="icon" className="rounded-full neon-border hover:bg-gray-800 transition-all ml-4">
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
        </div>
  
        {/* Neural Network Selection */}
        <Card className="mb-8 neon-border shadow-xl transition-all hover:scale-105">
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-white"></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {models.map((model) => (
    <Card
      key={model.id}
      className={`p-4 transition-all hover:scale-105 ${selectedModel === model.id ? "neon-border" : ""}`}
    >
      <h3 className="text-2xl font-bold text-gray-300 mb-2 transition-all hover:text-yellow-600 hover:font-extrabold">
        {model.name}
      </h3>
      <Button
        onClick={() => setSelectedModel(model.id)}
        className={`w-full neon-border ${selectedModel === model.id ? "bg-yellow-500 text-black" : "bg-white text-black"}`}
      >
        <Cpu className="mr-2 h-4 w-4" />
        {selectedModel === model.id ? "Active" : "Initialize"}
      </Button>
    </Card>
  ))}
</div>
          </CardContent>
        </Card>
  
        {/* Image Parameters */}
        <Card className="mb-8 neon-border shadow-xl transition-all hover:scale-105">
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-white">Image Parameters</h2>
            <div className="space-y-4">
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter neural prompt for image synthesis"
                className="w-full p-2 bg-gray-200 text-black neon-border"
              />
            </div>
            <Button
              onClick={handleGenerate}
              className="mt-4 w-full neon-border bg-orange-500 text-white transition-all hover:scale-105"
              disabled={isGenerating}
            >
              {isGenerating ? <Zap className="animate-spin mr-2 h-4 w-4" /> : <Cpu className="mr-2 h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
          </CardContent>
        </Card>
  
        {/* Generated Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedImages.length === 0 && !isGenerating ? (
            <p className="text-center col-span-full text-lg text-gray-500">No generated images yet.</p>
          ) : (
            generatedImages.map((imageData, index) => (
              <div key={index} className="relative">
                < img
                  src={imageData.imageUrl}
                  alt={`Generated Image ${index}`}
                  className="w-full h-auto rounded-lg shadow-xl hover:scale-105 transition-all"
                />
                <p className="text-center mt-2 text-sm text-gray-500">{imageData.prompt}</p>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                  <Button
                    onClick={() => handleDownload(imageData.imageUrl)}
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white transition-all hover:scale-105"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );}