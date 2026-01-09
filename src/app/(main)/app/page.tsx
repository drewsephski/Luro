"use client"

import React, { useState, useEffect } from 'react'
import { 
  ArrowDownIcon, 
  MessageSquareIcon, 
  SparklesIcon, 
  PlusIcon, 
  Trash2Icon,
  TrendingUpIcon,
  UsersIcon,
  BarChart3Icon,
  Share2Icon,
  Loader2Icon,
  TargetIcon,
  CalendarIcon,
  EyeIcon,
  ThumbsUpIcon,
  RepeatIcon,
  BotIcon,
  MicIcon,
  Volume2Icon
} from "lucide-react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Container } from "@/components"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfigureAgentModal } from '@/components/dashboard/configure-agent-modal'
import { AgentCard } from '@/components/dashboard/agent-card'
import { useAgents } from '@/hooks/use-agents'

interface DashboardData {
  metrics: {
    totalReach: number
    engagementRate: string
    activeCampaigns: number
    totalPosts: number
  }
  chartData: Array<{
    name: string
    reach: number
    engagement: number
  }>
  recentActivity: Array<{
    id: string
    platform: string
    content: string
    status: string
    likes: number
    shares: number
    createdAt: Date
  }>
}

const chartConfig = {
    reach: {
        label: "Total Reach",
        color: "hsl(var(--chart-1))",
    },
    engagement: {
        label: "Engagement",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const Page = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [aiInsights, setAiInsights] = useState<string | null>(null)
    const [aiLoading, setAiLoading] = useState(false)
    
    const {
      agents,
      loading: agentsLoading,
      createAgent,
      updateAgent,
      deleteAgent,
      refreshAgents
    } = useAgents()

    // Debug logging
    useEffect(() => {
      console.log('Dashboard - Agents updated:', agents);
      console.log('Dashboard - Agents loading:', agentsLoading);
    }, [agents, agentsLoading]);

    useEffect(() => {
        fetchDashboardData()
        // Test agents fetch directly
        fetch('/api/agents', { credentials: 'include' })
            .then(res => res.json())
            .then(data => console.log('Direct agents fetch result:', data))
            .catch(err => console.error('Direct agents fetch error:', err));
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch('/api/dashboard')
            
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data')
            }
            
            const data = await response.json()
            setDashboardData(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleAgentConfigure = async (config: any) => {
        console.log('Handle agent configure called with:', config);
        const result = await createAgent(config)
        if (result) {
            console.log('Agent created successfully:', result);
        } else {
            console.log('Agent creation failed');
        }
    }

    const handleAgentUpdate = async (id: string, config: any) => {
        console.log('Handle agent update called with:', id, config);
        const result = await updateAgent(id, config)
        if (result) {
            console.log('Agent updated successfully:', result);
        } else {
            console.log('Agent update failed');
        }
    }

    const handleAgentDelete = async (id: string) => {
        console.log('Handle agent delete called with:', id);
        const result = await deleteAgent(id)
        if (result) {
            console.log('Agent deleted successfully');
        } else {
            console.log('Agent delete failed');
        }
    }

    const fetchAIInsights = async () => {
        if (!dashboardData) return
        
        try {
            setAiLoading(true)
            setAiInsights(null)
            
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'analyze_performance',
                    data: dashboardData.metrics
                })
            })
            
            if (!response.ok) {
                throw new Error('Failed to fetch AI insights')
            }
            
            const data = await response.json()
            setAiInsights(data.analysis)
        } catch (err) {
            console.error('AI Insights error:', err)
        } finally {
            setAiLoading(false)
        }
    }

    const addSampleData = async () => {
        try {
            const today = new Date()
            const sampleData = [
                { date: today.toISOString(), metric: 'reach', value: 1500 },
                { date: today.toISOString(), metric: 'engagement', value: 75 }
            ]

            for (const data of sampleData) {
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
            }
            
            fetchDashboardData()
        } catch (error) {
            console.error('Error adding sample data:', error)
        }
    }

    const clearAllData = async () => {
        if (!confirm('Are you sure you want to clear all your dashboard data? This cannot be undone.')) {
            return
        }
        
        try {
            const response = await fetch('/api/clear-data', {
                method: 'POST'
            })
            
            if (!response.ok) {
                throw new Error('Failed to clear data')
            }
            
            fetchDashboardData()
            setAiInsights(null)
        } catch (error) {
            console.error('Error clearing data:', error)
        }
    }

    if (loading) {
        return (
            <div className="p-6 w-full">
                <div className="flex flex-col w-full space-y-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Container key={i} delay={i * 0.1}>
                                <Card className="h-32">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Skeleton className="h-10 w-24 mb-3" />
                                        <Skeleton className="h-4 w-40" />
                                    </CardContent>
                                </Card>
                            </Container>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Container delay={0.2} className="lg:col-span-2">
                            <Card className="h-96">
                                <CardHeader>
                                    <Skeleton className="h-6 w-48" />
                                </CardHeader>
                                <CardContent className="py-2">
                                    <Skeleton className="h-full w-full" />
                                </CardContent>
                            </Card>
                        </Container>
                        
                        <Container delay={0.3}>
                            <Card className="h-96">
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-48 mt-2" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <Skeleton className="h-12 w-12 rounded-lg" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-3/4" />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </Container>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 w-full">
                <div className="flex flex-col items-center justify-center h-96">
                    <div className="text-red-500 text-xl mb-6">Error loading dashboard</div>
                    <Button onClick={fetchDashboardData} size="lg">Retry</Button>
                </div>
            </div>
        )
    }

    if (!dashboardData) {
        return null
    }

    const isEmpty = dashboardData.metrics.totalReach === 0 && 
                   dashboardData.metrics.activeCampaigns === 0 && 
                   dashboardData.metrics.totalPosts === 0

    if (isEmpty) {
        return (
            <div className="p-6 w-full">
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="text-center max-w-3xl">
                        <div className="mb-8">
                            <div className="bg-muted rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto">
                                <BarChart3Icon className="h-12 w-12 text-muted-foreground" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
                        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                            Start tracking your social media performance by adding your first data points.
                            Add campaigns, posts, and analytics manually or get AI-powered insights from your conversations.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <Card className="hover:shadow-md transition-shadow border-border">
                                <CardHeader>
                                    <div className="bg-muted rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                                        <UsersIcon className="h-6 w-6 text-foreground" />
                                    </div>
                                    <CardTitle className="text-xl">Add Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Track reach, engagement, and other metrics manually through our API
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card className="hover:shadow-md transition-shadow border-border">
                                <CardHeader>
                                    <div className="bg-muted rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                                        <SparklesIcon className="h-6 w-6 text-foreground" />
                                    </div>
                                    <CardTitle className="text-xl">AI Insights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Get insights from conversations and automatically track relevant metrics
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card className="hover:shadow-md transition-shadow border-border">
                                <CardHeader>
                                    <div className="bg-muted rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                                        <TrendingUpIcon className="h-6 w-6 text-foreground" />
                                    </div>
                                    <CardTitle className="text-xl">Visualize Data</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        See your performance trends in beautiful charts and comprehensive reports
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                onClick={addSampleData} 
                                variant="outline" 
                                size="lg" 
                                className="px-8 py-6 border-border hover:bg-muted"
                            >
                                <PlusIcon className="mr-2 h-5 w-5" />
                                Add Sample Data
                            </Button>
                            <ConfigureAgentModal onConfigure={handleAgentConfigure}>
                                <Button 
                                    size="lg"
                                    className="px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <BotIcon className="mr-2 h-5 w-5" />
                                    Get Started with AI
                                </Button>
                            </ConfigureAgentModal>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 w-full">
            <div className="flex flex-col w-full space-y-8">
                {/* AI Insights Section */}
                <Container>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 rounded-lg p-2">
                                    <SparklesIcon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">AI Performance Insights</CardTitle>
                            </div>
                            <div className="flex gap-3">
                                <Button 
                                    onClick={fetchAIInsights} 
                                    disabled={aiLoading}
                                    variant="outline"
                                    className="border-border hover:bg-muted"
                                >
                                    {aiLoading ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="mr-2 h-4 w-4" />
                                            Get Insights
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    onClick={clearAllData}
                                    variant="outline"
                                    className="border-border text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2Icon className="mr-2 h-4 w-4" />
                                    Clear Data
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {aiInsights ? (
                                <div className="prose prose-sm max-w-none bg-muted/30 rounded-lg p-4">
                                    <p className="whitespace-pre-wrap text-base leading-relaxed">{aiInsights}</p>
                                </div>
                            ) : (
                                <div className="bg-muted/20 rounded-lg p-6 text-center">
                                    <SparklesIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-muted-foreground">
                                        Click "Get Insights" to receive AI-powered analysis of your performance metrics
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Container>

                {/* Agents Section */}
                <Container>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 rounded-lg p-2">
                                    <BotIcon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Your AI Agents</CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={refreshAgents}
                                    disabled={agentsLoading}
                                    className="border-border hover:bg-muted"
                                >
                                    {agentsLoading ? 'Refreshing...' : 'Refresh'}
                                </Button>
                                <ConfigureAgentModal onConfigure={handleAgentConfigure}>
                                    <Button variant="outline" className="border-border hover:bg-muted">
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        New Agent
                                    </Button>
                                </ConfigureAgentModal>
                            </div>
                        </CardHeader>
                        <CardContent>
                            
                            {agentsLoading ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {[...Array(3)].map((_, i) => (
                                        <Card key={i} className="h-48">
                                            <CardHeader>
                                                <Skeleton className="h-6 w-32" />
                                            </CardHeader>
                                            <CardContent>
                                                <Skeleton className="h-4 w-full mb-2" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : agents.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {agents.map((agent) => (
                                        <AgentCard
                                            key={agent.id}
                                            agent={agent}
                                            onUpdate={handleAgentUpdate}
                                            onDelete={handleAgentDelete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <BotIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Agents Yet</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Create your first AI agent to get started with voice interactions
                                    </p>
                                    <ConfigureAgentModal onConfigure={handleAgentConfigure}>
                                        <Button>
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                            Create Your First Agent
                                        </Button>
                                    </ConfigureAgentModal>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Container>

                {/* Dashboard Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Container>
                        <Card className="h-36 hover:shadow-md transition-shadow border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">Total Reach</CardTitle>
                                <div className="bg-primary/10 rounded-lg p-2">
                                    <UsersIcon className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-3xl font-bold">
                                    {dashboardData.metrics.totalReach.toLocaleString()}
                                </div>
                                <div className="flex items-center mt-2">
                                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-sm text-muted-foreground">
                                        +20.1% from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Container>
                    
                    <Container delay={0.1}>
                        <Card className="h-36 hover:shadow-md transition-shadow border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">Engagement Rate</CardTitle>
                                <div className="bg-primary/10 rounded-lg p-2">
                                    <Share2Icon className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-3xl font-bold">{dashboardData.metrics.engagementRate}%</div>
                                <div className="flex items-center mt-2">
                                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-sm text-muted-foreground">
                                        +1.2% from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Container>
                    
                    <Container delay={0.2}>
                        <Card className="h-36 hover:shadow-md transition-shadow border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">Active Campaigns</CardTitle>
                                <div className="bg-primary/10 rounded-lg p-2">
                                    <TargetIcon className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-3xl font-bold">{dashboardData.metrics.activeCampaigns}</div>
                                <div className="flex items-center mt-2">
                                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                                    <span className="text-sm text-muted-foreground">
                                        -2 from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Container>
                    
                    <Container delay={0.3}>
                        <Card className="h-36 hover:shadow-md transition-shadow border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">Total Posts</CardTitle>
                                <div className="bg-primary/10 rounded-lg p-2">
                                    <MessageSquareIcon className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-3xl font-bold">{dashboardData.metrics.totalPosts}</div>
                                <div className="flex items-center mt-2">
                                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-sm text-muted-foreground">
                                        +48 from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Container>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <Container delay={0.2} className="lg:col-span-2">
                        <Card className="h-96 border-border">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <TrendingUpIcon className="h-5 w-5" />
                                    Performance Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <ChartContainer config={chartConfig} className="h-72 w-full">
                                    <AreaChart
                                        accessibilityLayer
                                        data={dashboardData.chartData}
                                        margin={{ left: 12, right: 12, top: 12 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(5)}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <defs>
                                            <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="hsl(var(--chart-1))"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="hsl(var(--chart-1))"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                            <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="hsl(var(--chart-2))"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="hsl(var(--chart-2))"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            dataKey="engagement"
                                            type="natural"
                                            fill="url(#fillEngagement)"
                                            fillOpacity={0.4}
                                            stroke="hsl(var(--chart-2))"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            dataKey="reach"
                                            type="natural"
                                            fill="url(#fillReach)"
                                            fillOpacity={0.4}
                                            stroke="hsl(var(--chart-1))"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </Container>

                    {/* Recent Activity */}
                    <Container delay={0.3}>
                        <Card className="h-96 border-border">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    Recent Posts
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Latest activity from your social media posts
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4 overflow-y-auto max-h-72">
                                {dashboardData.recentActivity.map((post) => (
                                    <div key={post.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                                        <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                                            <MessageSquareIcon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate mb-1">{post.content}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded">
                                                    {post.platform}
                                                </span>
                                                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <ThumbsUpIcon className="h-3 w-3 mr-1" />
                                                        {post.likes}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <RepeatIcon className="h-3 w-3 mr-1" />
                                                        {post.shares}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </Container>
                </div>
            </div>
        </div>
    )
}

export default Page