"use client";

import React, { useState } from 'react';
import { 
  FilmIcon, 
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

interface VideoModel {
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

const VIDEO_MODELS: VideoModel[] = [
  {
    id: "sora",
    name: "Sora",
    company: "OpenAI",
    description: "Advanced text-to-video generation model capable of creating realistic and imaginative scenes from text instructions.",
    ranking: 1,
    rating: 9.5,
    price: "Closed Beta",
    features: ["High resolution output", "Long video generation", "Strong prompt following", "Realistic physics"],
    useCases: ["Creative content", "Education", "Marketing", "Entertainment"],
    website: "https://openai.com/sora",
    releaseDate: "February 2024",
    strengths: ["Industry-leading quality", "Excellent prompt adherence", "Versatile use cases"],
    weaknesses: ["Limited public access", "High computational requirements"],
    logo: "https://openai.com/favicon.ico"
  },
  {
    id: "pika-labs",
    name: "Pika Labs",
    company: "Pika Labs",
    description: "Professional-grade video generation platform with intuitive interface and high-quality output.",
    ranking: 2,
    rating: 9.2,
    price: "$10-50/video",
    features: ["Easy-to-use interface", "Multiple aspect ratios", "Camera motion control", "Style transfer"],
    useCases: ["Social media content", "Short films", "Product demos", "Animations"],
    website: "https://pika.art",
    releaseDate: "2023",
    strengths: ["User-friendly", "Fast rendering", "Good value for money"],
    weaknesses: ["Limited customization", "Shorter video lengths"],
    logo: "https://pika.art/favicon.ico"
  },
  {
    id: "runway-gen3",
    name: "Runway Gen-3 Alpha",
    company: "Runway ML",
    description: "Next-generation video generation with advanced editing capabilities and cinematic quality.",
    ranking: 3,
    rating: 9.0,
    price: "Starting at $12/month",
    features: ["Video editing tools", "Motion brush", "Green screen removal", "Multi-person scenes"],
    useCases: ["Filmmaking", "Commercial production", "Visual effects", "Storytelling"],
    website: "https://runwayml.com",
    releaseDate: "June 2024",
    strengths: ["Professional tools", "Advanced editing", "Cinematic quality"],
    weaknesses: ["Expensive for heavy use", "Steep learning curve"],
    logo: "https://runwayml.com/favicon.ico"
  },
  {
    id: "luma-dream-machine",
    name: "Luma Dream Machine",
    company: "Luma Labs",
    description: "High-quality 3D scene generation and video synthesis with photorealistic results.",
    ranking: 4,
    rating: 8.8,
    price: "Free tier available",
    features: ["3D scene generation", "Photorealistic output", "Scene transitions", "Object manipulation"],
    useCases: ["Architecture visualization", "Gaming", "Virtual tours", "Product showcases"],
    website: "https://lumalabs.ai",
    releaseDate: "2023",
    strengths: ["Photorealistic quality", "3D capabilities", "Good free tier"],
    weaknesses: ["Limited text control", "Slower processing"],
    logo: "https://lumalabs.ai/favicon.ico"
  },
  {
    id: "heygen",
    name: "HeyGen",
    company: "HeyGen",
    description: "AI-powered video generation focused on talking head videos and personalized content.",
    ranking: 5,
    rating: 8.5,
    price: "$24-129/month",
    features: ["Talking avatar creation", "Multilingual support", "Custom avatars", "Template library"],
    useCases: ["Training videos", "Customer service", "E-learning", "Marketing"],
    website: "https://www.heygen.com",
    releaseDate: "2022",
    strengths: ["Specialized for talking heads", "Enterprise features", "Good customer support"],
    weaknesses: ["Limited creative freedom", "Higher cost"],
    logo: "https://www.heygen.com/favicon.ico"
  },
  {
    id: "synthesia",
    name: "Synthesia",
    company: "Synthesia",
    description: "Enterprise video generation platform specializing in AI avatars and multilingual content.",
    ranking: 6,
    rating: 8.3,
    price: "$30-67/month",
    features: ["AI avatar library", "120+ languages", "Brand kit integration", "Analytics dashboard"],
    useCases: ["Corporate training", "Global communications", "Onboarding", "Compliance"],
    website: "https://www.synthesia.io",
    releaseDate: "2017",
    strengths: ["Enterprise-grade", "Extensive language support", "Professional templates"],
    weaknesses: ["Expensive", "Less creative flexibility"],
    logo: "https://www.synthesia.io/favicon.ico"
  },
  {
    id: "kaiber",
    name: "Kaiber",
    company: "Kaiber AI",
    description: "Creative video generation with artistic styles and music synchronization capabilities.",
    ranking: 7,
    rating: 8.0,
    price: "$19-49/month",
    features: ["Artistic style transfer", "Music sync", "Visual effects", "Looping animations"],
    useCases: ["Music videos", "Art projects", "Social media", "Creative content"],
    website: "https://kaiber.ai",
    releaseDate: "2022",
    strengths: ["Artistic focus", "Music integration", "Unique visual styles"],
    weaknesses: ["Niche market", "Less photorealistic"],
    logo: "https://kaiber.ai/favicon.ico"
  },
  {
    id: "stability-video",
    name: "Stable Video Diffusion",
    company: "Stability AI",
    description: "Open-source video generation model with good quality and community support.",
    ranking: 8,
    rating: 7.8,
    price: "Free/Open-source",
    features: ["Open-source", "Community support", "Customizable", "Research friendly"],
    useCases: ["Research", "Prototyping", "Custom development", "Educational"],
    website: "https://stability.ai",
    releaseDate: "November 2023",
    strengths: ["Free to use", "Open-source", "Good for developers"],
    weaknesses: ["Lower quality than commercial", "Requires technical expertise"],
    logo: "https://stability.ai/favicon.ico"
  }
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ranking");
  const [filterPrice, setFilterPrice] = useState("all");

  const filteredModels = VIDEO_MODELS.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = filterPrice === "all" || 
                        (filterPrice === "free" && (model.price === "Free tier available" || model.price === "Free/Open-source")) ||
                        (filterPrice === "paid" && model.price !== "Free tier available" && model.price !== "Free/Open-source") ||
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
    if (price.includes("Beta")) return <Badge variant="outline">Beta</Badge>;
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
                <FilmIcon className="h-8 w-8 text-primary" />
                AI Video Generation Models Directory
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive ranking of the best AI video generation models available today
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
                  <div className="text-2xl font-bold text-primary">{VIDEO_MODELS.length}</div>
                  <div className="text-sm text-muted-foreground">Total Models</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {VIDEO_MODELS.filter(m => m.price?.includes("Free")).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Free Options</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {Math.max(...VIDEO_MODELS.map(m => m.rating)).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {VIDEO_MODELS.filter(m => m.price?.includes("$")).length}
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
                <FilmIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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