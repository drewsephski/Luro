"use client";

import React, { useState } from 'react';
import { 
  MicIcon, 
  StarIcon, 
  ExternalLinkIcon, 
  FilterIcon, 
  SearchIcon,
  ChevronDownIcon,
  CheckIcon,
  GlobeIcon,
  ZapIcon,
  DollarSignIcon,
  CalendarIcon,
  HeadphonesIcon,
  MessageCircleIcon,
  PhoneIcon
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

interface VoiceAgent {
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
  languages: string[];
  integrations: string[];
}

const VOICE_AGENTS: VoiceAgent[] = [
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    company: "ElevenLabs",
    description: "Premium AI voice generation and speech synthesis platform with lifelike voices and extensive customization options.",
    ranking: 1,
    rating: 9.4,
    price: "$5-99/month",
    features: ["Lifelike voices", "Emotion control", "Language translation", "Studio quality"],
    useCases: ["Content creation", "Audiobooks", "Customer service", "Gaming"],
    website: "https://elevenlabs.io",
    releaseDate: "2022",
    strengths: ["Industry-leading quality", "Extensive voice library", "Advanced customization", "Real-time generation"],
    weaknesses: ["Higher cost", "Credit-based system"],
    logo: "https://elevenlabs.io/favicon.ico",
    languages: ["English", "Spanish", "French", "German", "Japanese"],
    integrations: ["API", "Web App", "Plugins"]
  },
  {
    id: "openai-whisper",
    name: "Whisper",
    company: "OpenAI",
    description: "Advanced speech recognition and transcription model with exceptional accuracy across multiple languages.",
    ranking: 2,
    rating: 9.2,
    price: "Free/Open-source",
    features: ["Speech-to-text", "Multilingual support", "Noise robustness", "Speaker detection"],
    useCases: ["Transcription", "Accessibility", "Research", "Content indexing"],
    website: "https://openai.com/research/whisper",
    releaseDate: "September 2022",
    strengths: ["Free to use", "High accuracy", "Many languages", "Robust to noise"],
    weaknesses: ["No real-time capabilities", "Processing time required"],
    logo: "https://openai.com/favicon.ico",
    languages: ["99+ languages"],
    integrations: ["API", "Python library", "Third-party tools"]
  },
  {
    id: "assemblyai",
    name: "AssemblyAI",
    company: "AssemblyAI",
    description: "Enterprise-grade speech-to-text API with specialized features for business applications.",
    ranking: 3,
    rating: 9.0,
    price: "$0.004/min",
    features: ["Real-time transcription", "Speaker diarization", "Content moderation", "Summarization"],
    useCases: ["Call centers", "Meetings", "Podcasts", "Media monitoring"],
    website: "https://www.assemblyai.com",
    releaseDate: "2017",
    strengths: ["Enterprise features", "High accuracy", "Specialized models", "Good documentation"],
    weaknesses: ["Pay-per-use", "API dependency"],
    logo: "https://www.assemblyai.com/favicon.ico",
    languages: ["English", "Spanish", "French", "Portuguese"],
    integrations: ["API", "SDKs", "Webhooks"]
  },
  {
    id: "deepgram",
    name: "Deepgram",
    company: "Deepgram",
    description: "AI-powered speech recognition platform designed for real-time applications and enterprise use.",
    ranking: 4,
    rating: 8.8,
    price: "$0.004/min",
    features: ["Real-time processing", "Streaming audio", "Custom vocabulary", "Topic detection"],
    useCases: ["Live captioning", "Voice assistants", "Broadcast", "Telehealth"],
    website: "https://deepgram.com",
    releaseDate: "2015",
    strengths: ["Real-time capabilities", "Low latency", "Custom models", "Scalable"],
    weaknesses: ["Complex setup", "Higher costs at scale"],
    logo: "https://deepgram.com/favicon.ico",
    languages: ["English", "Spanish", "French", "German"],
    integrations: ["API", "SDKs", "WebSocket"]
  },
  {
    id: "amazon-transcribe",
    name: "Amazon Transcribe",
    company: "Amazon AWS",
    description: "Cloud-based speech recognition service with automatic punctuation and speaker identification.",
    ranking: 5,
    rating: 8.6,
    price: "$0.004/min",
    features: ["Automatic punctuation", "Speaker identification", "Vocabulary filtering", "PII redaction"],
    useCases: ["Business meetings", "Customer service", "Legal", "Healthcare"],
    website: "https://aws.amazon.com/transcribe",
    releaseDate: "2018",
    strengths: ["AWS integration", "Enterprise security", "PII handling", "Reliable"],
    weaknesses: ["AWS lock-in", "Less flexible pricing"],
    logo: "https://amazon.com/favicon.ico",
    languages: ["English", "Spanish", "French", "Italian"],
    integrations: ["AWS services", "API", "SDKs"]
  },
  {
    id: "google-speech",
    name: "Google Speech-to-Text",
    company: "Google Cloud",
    description: "Google's cloud speech recognition service with neural network models and streaming capabilities.",
    ranking: 6,
    rating: 8.4,
    price: "$0.004/min",
    features: ["Neural network models", "Streaming recognition", "Word-level confidence", "Enhanced models"],
    useCases: ["Voice commands", "Interactive voice response", "Media", "Research"],
    website: "https://cloud.google.com/speech-to-text",
    releaseDate: "2016",
    strengths: ["Google ecosystem", "High accuracy", "Streaming support", "Multiple models"],
    weaknesses: ["Google dependency", "Pricing complexity"],
    logo: "https://google.com/favicon.ico",
    languages: ["125+ languages"],
    integrations: ["Google Cloud", "API", "Client libraries"]
  },
  {
    id: "murf-ai",
    name: "Murf AI",
    company: "Murf AI",
    description: "User-friendly AI voice generator with studio-quality voices and easy-to-use interface.",
    ranking: 7,
    rating: 8.2,
    price: "$29-89/month",
    features: ["Studio voices", "Easy editing", "Background music", "Collaboration tools"],
    useCases: ["E-learning", "Presentations", "Marketing", "YouTube videos"],
    website: "https://murf.ai",
    releaseDate: "2021",
    strengths: ["User-friendly", "Good quality", "Editing tools", "Team features"],
    weaknesses: ["Limited voices", "Subscription model"],
    logo: "https://murf.ai/favicon.ico",
    languages: ["English", "Spanish", "French", "German"],
    integrations: ["Web app", "API", "Browser extension"]
  },
  {
    id: "playht",
    name: "PlayHT",
    company: "PlayHT",
    description: "AI voice generation platform with real-time streaming and extensive voice cloning capabilities.",
    ranking: 8,
    rating: 8.0,
    price: "$19-199/month",
    features: ["Voice cloning", "Real-time streaming", "Emotional voices", "Audio editing"],
    useCases: ["Podcasting", "Audiobooks", "Voiceovers", "Interactive content"],
    website: "https://play.ht",
    releaseDate: "2019",
    strengths: ["Voice cloning", "Real-time capabilities", "Good variety", "API access"],
    weaknesses: ["Higher-tier pricing", "Learning curve"],
    logo: "https://play.ht/favicon.ico",
    languages: ["English", "Spanish", "French", "Arabic"],
    integrations: ["API", "Web app", "WordPress plugin"]
  }
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ranking");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredAgents = VOICE_AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = filterPrice === "all" || 
                        (filterPrice === "free" && (agent.price === "Free" || agent.price === "Free/Open-source")) ||
                        (filterPrice === "paid" && agent.price !== "Free" && agent.price !== "Free/Open-source") ||
                        (filterPrice === "enterprise" && (agent.price?.includes("$") || agent.price?.includes("month")));
    
    const matchesType = filterType === "all" ||
                       (filterType === "speech-to-text" && agent.features.some(f => f.toLowerCase().includes("speech"))) ||
                       (filterType === "text-to-speech" && agent.features.some(f => f.toLowerCase().includes("voice"))) ||
                       (filterType === "both" && agent.features.some(f => f.toLowerCase().includes("speech")) && agent.features.some(f => f.toLowerCase().includes("voice")));
    
    return matchesSearch && matchesPrice && matchesType;
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
    return <Badge variant="secondary">${price}</Badge>;
  };

  const getTypeBadges = (features: string[]) => {
    const hasSpeechToText = features.some(f => f.toLowerCase().includes("speech"));
    const hasTextToSpeech = features.some(f => f.toLowerCase().includes("voice"));
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {hasSpeechToText && (
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <MicIcon className="h-3 w-3" />
            Speech-to-Text
          </Badge>
        )}
        {hasTextToSpeech && (
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <HeadphonesIcon className="h-3 w-3" />
            Text-to-Speech
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col w-full space-y-8">
        {/* Header */}
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <MicIcon className="h-8 w-8 text-primary" />
                AI Voice Agent Rankings
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive ranking of the best AI voice agents and speech technologies
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36 flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Type</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="speech-to-text">Speech-to-Text</SelectItem>
                  <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
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
                Voice Technology Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{VOICE_AGENTS.length}</div>
                  <div className="text-sm text-muted-foreground">Total Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {VOICE_AGENTS.filter(a => a.price?.includes("Free")).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Free Options</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {Math.max(...VOICE_AGENTS.map(a => a.rating)).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {VOICE_AGENTS.filter(a => a.features.some(f => f.toLowerCase().includes("real-time"))).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Real-time Capable</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>

        {/* Agents Grid */}
        <div className="grid gap-6">
          {filteredAgents.map((agent, index) => (
            <Container key={agent.id} delay={0.1 + index * 0.05}>
              <Card className="hover:shadow-lg transition-all duration-300 border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {agent.logo && (
                        <img 
                          src={agent.logo} 
                          alt={`${agent.company} logo`}
                          className="w-12 h-12 rounded-lg object-contain bg-muted p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold">{agent.name}</h2>
                          {getRankingBadge(agent.ranking)}
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                            <span className="font-semibold">{agent.rating}/10</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-2">{agent.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <GlobeIcon className="h-3 w-3" />
                            {agent.company}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {agent.releaseDate}
                          </Badge>
                          {getPriceBadge(agent.price)}
                        </div>
                        {getTypeBadges(agent.features)}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-border hover:bg-muted"
                      onClick={() => window.open(agent.website, '_blank')}
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
                        {agent.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Languages Supported</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.languages.slice(0, 4).map((lang, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                          {agent.languages.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{agent.languages.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Best For</h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.useCases.map((useCase, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Integrations</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.integrations.map((integration, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {integration}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-green-600">Strengths</h4>
                          <ul className="space-y-1">
                            {agent.strengths.slice(0, 2).map((strength, idx) => (
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
                            {agent.weaknesses.slice(0, 2).map((weakness, idx) => (
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

        {filteredAgents.length === 0 && (
          <Container>
            <Card className="text-center py-12">
              <CardContent>
                <MicIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No agents found</h3>
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