"use client";

import React, { useState } from 'react';
import { 
  ImageIcon, 
  StarIcon, 
  ExternalLinkIcon, 
  FilterIcon, 
  SearchIcon,
  ChevronDownIcon,
  CheckIcon,
  GlobeIcon,
  ZapIcon,
  DollarSignIcon,
  CalendarIcon
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container } from "@/components";

interface ImageModel {
  id: string;
  name: string;
  company: string;
  description: string;
  ranking: number;
  rating: number;
  price?: string;
  features: string[];
  useCases: string[];
  website: string;
  releaseDate: string;
  strengths: string[];
  weaknesses: string[];
  logo?: string;
}

const IMAGE_MODELS: ImageModel[] = [
  {
    id: "dalle-3",
    name: "DALL-E 3",
    company: "OpenAI",
    description: "Advanced text-to-image generation model with exceptional detail and accuracy in following prompts.",
    ranking: 1,
    rating: 9.6,
    price: "$0.04-0.12/image",
    features: ["High resolution output", "Detailed prompt interpretation", "Consistent style", "Text generation in images"],
    useCases: ["Concept art", "Marketing materials", "Illustrations", "Design inspiration"],
    website: "https://openai.com/dall-e-3",
    releaseDate: "September 2023",
    strengths: ["Industry-leading quality", "Excellent prompt following", "Text integration", "Consistent results"],
    weaknesses: ["Can be expensive at scale", "Limited customization options"],
    logo: "https://openai.com/favicon.ico"
  },
  {
    id: "midjourney-v6",
    name: "Midjourney V6",
    company: "Midjourney",
    description: "Popular AI art generator known for artistic and stylized image creation with community-driven features.",
    ranking: 2,
    rating: 9.3,
    price: "$10-60/month",
    features: ["Artistic style focus", "Community features", "Style references", "Parameter controls"],
    useCases: ["Digital art", "Concept visualization", "Creative projects", "Social media content"],
    website: "https://www.midjourney.com",
    releaseDate: "December 2023",
    strengths: ["Exceptional artistic quality", "Active community", "Style variety", "Good value"],
    weaknesses: ["Discord-based interface", "Learning curve for parameters"],
    logo: "https://www.midjourney.com/favicon.ico"
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    company: "Stability AI",
    description: "Open-source image generation model with high quality output and extensive customization options.",
    ranking: 3,
    rating: 9.1,
    price: "Free/Open-source",
    features: ["Open-source", "High resolution", "Custom training", "ControlNet support"],
    useCases: ["Research", "Custom development", "Commercial applications", "Art creation"],
    website: "https://stability.ai",
    releaseDate: "July 2023",
    strengths: ["Free to use", "Highly customizable", "Good for developers", "Local deployment"],
    weaknesses: ["Requires technical knowledge", "Resource intensive", "Setup complexity"],
    logo: "https://stability.ai/favicon.ico"
  },
  {
    id: "imagen-2",
    name: "Imagen 2",
    company: "Google",
    description: "Google's advanced text-to-image model with photorealistic capabilities and strong language understanding.",
    ranking: 4,
    rating: 8.9,
    price: "Research/API access",
    features: ["Photorealistic output", "Strong language understanding", "High resolution", "Google integration"],
    useCases: ["Photography", "Advertising", "Scientific visualization", "Product design"],
    website: "https://imagen.research.google",
    releaseDate: "May 2023",
    strengths: ["Photorealistic quality", "Strong prompt understanding", "Google ecosystem", "Research grade"],
    weaknesses: ["Limited public access", "API restrictions"],
    logo: "https://google.com/favicon.ico"
  },
  {
    id: "leonardo-ai",
    name: "Leonardo AI",
    company: "Leonardo AI",
    description: "User-friendly AI image generation platform with fast rendering and style training capabilities.",
    ranking: 5,
    rating: 8.7,
    price: "$15-100/month",
    features: ["Fast generation", "Style training", "Multiple models", "Team collaboration"],
    useCases: ["Game assets", "Character design", "Visual development", "Concept art"],
    website: "https://leonardo.ai",
    releaseDate: "2022",
    strengths: ["Fast rendering", "Style customization", "Good for teams", "Asset library"],
    weaknesses: ["Subscription model", "Limited free tier"],
    logo: "https://leonardo.ai/favicon.ico"
  },
  {
    id: "pixlr",
    name: "Pixlr AI",
    company: "Pixlr",
    description: "Integrated AI image editing and generation tool with familiar Photoshop-like interface.",
    ranking: 6,
    rating: 8.4,
    price: "Free-$9.99/month",
    features: ["Photo editing integration", "Familiar interface", "Batch processing", "Mobile apps"],
    useCases: ["Photo editing", "Quick image generation", "Social media", "Basic design"],
    website: "https://pixlr.com",
    releaseDate: "2023",
    strengths: ["Easy to learn", "Integrated editing", "Good free option", "Mobile support"],
    weaknesses: ["Less advanced features", "Quality limitations"],
    logo: "https://pixlr.com/favicon.ico"
  },
  {
    id: "adobe-firefly",
    name: "Adobe Firefly",
    company: "Adobe",
    description: "Adobe's AI image generation integrated with Creative Cloud suite and commercial licensing.",
    ranking: 7,
    rating: 8.2,
    price: "Included with Adobe CC",
    features: ["Adobe integration", "Commercial license", "Generative fill", "Vector graphics"],
    useCases: ["Professional design", "Commercial work", "Brand content", "Print design"],
    website: "https://firefly.adobe.com",
    releaseDate: "March 2023",
    strengths: ["Commercial rights", "Adobe ecosystem", "Professional tools", "Legal protection"],
    weaknesses: ["Requires Adobe subscription", "Limited standalone use"],
    logo: "https://adobe.com/favicon.ico"
  },
  {
    id: "bing-image-creator",
    name: "Bing Image Creator",
    company: "Microsoft",
    description: "Free AI image generation powered by DALL-E, integrated with Bing search and Microsoft services.",
    ranking: 8,
    rating: 7.9,
    price: "Free",
    features: ["Free to use", "Bing integration", "Simple interface", "Web-based"],
    useCases: ["Quick image ideas", "Basic content", "Experimentation", "Students"],
    website: "https://www.bing.com/images/create",
    releaseDate: "October 2023",
    strengths: ["Completely free", "Easy access", "Good for beginners", "No registration"],
    weaknesses: ["Quality limitations", "Limited features", "No commercial use"],
    logo: "https://microsoft.com/favicon.ico"
  }
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ranking");
  const [filterPrice, setFilterPrice] = useState("all");

  const filteredModels = IMAGE_MODELS.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = filterPrice === "all" || 
                        (filterPrice === "free" && (model.price === "Free" || model.price === "Free/Open-source")) ||
                        (filterPrice === "paid" && model.price !== "Free" && model.price !== "Free/Open-source") ||
                        (filterPrice === "enterprise" && (model.price?.includes("$") || model.price?.includes("month")));
    
    return matchesSearch && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "company":
        return a.company.localeCompare(b.company);
      default:
        return a.ranking - b.ranking;
    }
  });

  const getRankingBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
          #{rank} Top
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        #{rank}
      </Badge>
    );
  };

  const getPriceBadge = (price?: string) => {
    if (!price) return <Badge variant="outline">Contact Sales</Badge>;
    if (price.includes("Free")) return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Free</Badge>;
    if (price.includes("Research")) return <Badge variant="outline">Research</Badge>;
    return <Badge variant="secondary">${price}</Badge>;
  };

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col w-full space-y-8">
        {/* Header */}
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-primary" />
                AI Image Generation Models Directory
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive ranking of the best AI image generation models available today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 flex items-center gap-2">
                  <FilterIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Sort by</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranking">Ranking</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPrice} onValueChange={setFilterPrice}>
                <SelectTrigger className="w-32 flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Price</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Container>

        {/* Stats Summary */}
        <Container delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ZapIcon className="h-5 w-5" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{IMAGE_MODELS.length}</div>
                  <div className="text-sm text-muted-foreground">Total Models</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {IMAGE_MODELS.filter(m => m.price?.includes("Free")).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Free Options</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {Math.max(...IMAGE_MODELS.map(m => m.rating)).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {IMAGE_MODELS.filter(m => m.price?.includes("$")).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Paid Services</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>

        {/* Models Grid */}
        <div className="grid gap-6">
          {filteredModels.map((model, index) => (
            <Container key={model.id} delay={0.1 + index * 0.05}>
              <Card className="hover:shadow-lg transition-all duration-300 border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {model.logo && (
                        <img 
                          src={model.logo} 
                          alt={`${model.company} logo`}
                          className="w-12 h-12 rounded-lg object-contain bg-muted p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold">{model.name}</h2>
                          {getRankingBadge(model.ranking)}
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                            <span className="font-semibold">{model.rating}/10</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-2">{model.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <GlobeIcon className="h-3 w-3" />
                            {model.company}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {model.releaseDate}
                          </Badge>
                          {getPriceBadge(model.price)}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-border hover:bg-muted"
                      onClick={() => window.open(model.website, '_blank')}
                    >
                      <ExternalLinkIcon className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {model.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Best For</h3>
                      <div className="flex flex-wrap gap-2">
                        {model.useCases.map((useCase, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-green-600">Strengths</h4>
                          <ul className="space-y-1">
                            {model.strengths.slice(0, 2).map((strength, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-1">
                                <CheckIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-red-600">Weaknesses</h4>
                          <ul className="space-y-1">
                            {model.weaknesses.slice(0, 2).map((weakness, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-1">
                                <ChevronDownIcon className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Container>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <Container>
            <Card className="text-center py-12">
              <CardContent>
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No models found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          </Container>
        )}
      </div>
    </div>
  );
};

export default Page;