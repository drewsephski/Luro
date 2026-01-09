"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  BotIcon, 
  SettingsIcon, 
  MicIcon, 
  Volume2Icon,
  SparklesIcon,
  EditIcon,
  PlusIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AgentConfig {
  name: string
  personality: string
  voiceStyle: string
  expertise: string
  greeting: string
  tone: string
}

interface ConfigureAgentModalProps {
  onConfigure: (config: AgentConfig) => void
  onUpdate?: (id: string, config: AgentConfig) => void
  agent?: {
    id: string
    name: string
    personality: string
    voiceStyle: string
    expertise: string
    greeting: string
    tone: string
  }
  children: React.ReactNode
}

export function ConfigureAgentModal({ onConfigure, onUpdate, agent, children }: ConfigureAgentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<AgentConfig>({
    name: agent?.name || '',
    personality: agent?.personality || 'friendly',
    voiceStyle: agent?.voiceStyle || 'professional',
    expertise: agent?.expertise || 'general',
    greeting: agent?.greeting || 'Hello! How can I help you today?',
    tone: agent?.tone || 'helpful'
  })

  useEffect(() => {
    if (agent) {
      setConfig({
        name: agent.name,
        personality: agent.personality,
        voiceStyle: agent.voiceStyle,
        expertise: agent.expertise,
        greeting: agent.greeting,
        tone: agent.tone
      })
    } else {
      setConfig({
        name: '',
        personality: 'friendly',
        voiceStyle: 'professional',
        expertise: 'general',
        greeting: 'Hello! How can I help you today?',
        tone: 'helpful'
      })
    }
  }, [agent, isOpen])

  const handleSubmit = () => {
    if (config.name.trim()) {
      if (agent && onUpdate) {
        onUpdate(agent.id, config)
      } else {
        onConfigure(config)
      }
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-primary" />
            {agent ? 'Edit AI Agent' : 'Configure Your AI Agent'}
          </DialogTitle>
          <DialogDescription>
            {agent 
              ? 'Update your voice agent\'s settings and personality.'
              : 'Customize your voice agent\'s personality, voice style, and behavior to match your brand.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Agent Name */}
          <div className="grid gap-2">
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              placeholder="Enter your agent's name"
              value={config.name}
              onChange={(e) => setConfig({...config, name: e.target.value})}
            />
          </div>

          {/* Personality */}
          <div className="grid gap-2">
            <Label>Personality</Label>
            <Select value={config.personality} onValueChange={(value) => setConfig({...config, personality: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select personality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                <SelectItem value="professional">Professional & Formal</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                <SelectItem value="calm">Calm & Collected</SelectItem>
                <SelectItem value="witty">Witty & Humorous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Voice Style */}
          <div className="grid gap-2">
            <Label>Voice Style</Label>
            <Select value={config.voiceStyle} onValueChange={(value) => setConfig({...config, voiceStyle: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select voice style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
                <SelectItem value="warm">Warm & Friendly</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expertise */}
          <div className="grid gap-2">
            <Label>Expertise Area</Label>
            <Select value={config.expertise} onValueChange={(value) => setConfig({...config, expertise: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Assistant</SelectItem>
                <SelectItem value="customer-support">Customer Support</SelectItem>
                <SelectItem value="sales">Sales & Marketing</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="healthcare">Healthcare Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={config.tone} onValueChange={(value) => setConfig({...config, tone: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="helpful">Helpful & Supportive</SelectItem>
                <SelectItem value="direct">Direct & Concise</SelectItem>
                <SelectItem value="empathetic">Empathetic & Understanding</SelectItem>
                <SelectItem value="confident">Confident & Assertive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Greeting */}
          <div className="grid gap-2">
            <Label htmlFor="greeting">Custom Greeting</Label>
            <Textarea
              id="greeting"
              placeholder="Enter a custom greeting for your agent"
              value={config.greeting}
              onChange={(e) => setConfig({...config, greeting: e.target.value})}
              rows={3}
            />
          </div>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <SettingsIcon className="h-4 w-4" />
                Agent Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Name:</span> {config.name || 'Unnamed Agent'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Personality:</span> {config.personality}
              </div>
              <div className="text-sm">
                <span className="font-medium">Voice:</span> {config.voiceStyle}
              </div>
              <div className="text-sm">
                <span className="font-medium">Expertise:</span> {config.expertise}
              </div>
              <div className="text-sm">
                <span className="font-medium">Greeting:</span> "{config.greeting}"
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!config.name.trim()}>
            {agent ? (
              <>
                <EditIcon className="mr-2 h-4 w-4" />
                Update Agent
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 h-4 w-4" />
                Create Agent
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}