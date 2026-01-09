# Dynamic Dashboard with AI Integration

## Features Added

### Backend API Routes
- `/api/dashboard` - Fetches all dashboard data including metrics, charts, and recent activity
- `/api/campaigns` - Manage marketing campaigns (GET/POST)
- `/api/posts` - Manage social media posts (GET/POST)
- `/api/analytics` - Add and retrieve analytics data (GET/POST)
- `/api/ai/analyze` - AI-powered insights using OpenRouter

### Database Models
Extended Prisma schema with:
- **Campaign** model for marketing campaigns
- **Post** model for social media content
- **Analytics** model for performance tracking
- Proper relations between User and these entities

### AI Integration
Integrated OpenRouter AI SDK for:
- Performance analysis
- Content optimization suggestions
- Campaign strategy recommendations
- Conversation analysis that persists data to dashboard

### Dynamic Dashboard
- Real-time data fetching from API routes
- Loading states and error handling
- Interactive AI insights panel
- Responsive chart visualization
- Recent activity feed
- Clean empty state with user guidance

## Setup Instructions

1. **Environment Variables**
   Add to your `.env` file:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

2. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Dependencies**
   ```bash
   pnpm add @openrouter/ai-sdk-provider ai
   ```

## API Endpoints

### GET `/api/dashboard`
Returns comprehensive dashboard data:
```json
{
  "metrics": {
    "totalReach": 125000,
    "engagementRate": "4.3",
    "activeCampaigns": 2,
    "totalPosts": 15
  },
  "chartData": [...],
  "recentActivity": [...]
}
```

### POST `/api/analytics`
Add analytics data:
```json
{
  "date": "2024-01-08",
  "metric": "reach",
  "value": 1500
}
```

### POST `/api/ai/analyze`
Request AI insights:
```json
{
  "type": "analyze_performance",
  "data": { /* dashboard metrics */ }
}
```

Or for conversation analysis that persists data:
```json
{
  "type": "conversation_analysis",
  "conversation": "User discussed their social media strategy..."
}
```

### GET/POST `/api/campaigns`
Manage marketing campaigns

### GET/POST `/api/posts`  
Manage social media posts

## Data Approach

Unlike traditional dashboards, this system:
- **Starts empty** - No automatic sample data
- **User-driven data entry** - Users add their own campaigns, posts, and analytics
- **AI-powered data persistence** - When users "Get Insights" from conversations, relevant metrics are automatically tracked
- **Organic growth** - Dashboard fills up naturally as users interact with the system

## User Experience

1. **Empty State** - New users see a welcoming empty dashboard with clear CTAs
2. **Manual Entry** - Users can add data through API calls or UI forms
3. **AI Integration** - Conversations with AI assistant automatically generate and persist relevant metrics
4. **Visual Feedback** - Charts and metrics update in real-time as data is added

## AI Analysis Types

1. **Performance Analysis** - Overall performance insights from existing metrics
2. **Content Suggestions** - Social media content optimization
3. **Campaign Strategy** - Marketing campaign recommendations
4. **Conversation Analysis** - Analyzes discussions and persists extracted metrics

## Error Handling

All API routes include:
- Authentication checks
- Input validation
- Error responses with appropriate status codes
- Automatic user creation for new users
- Graceful handling of empty datasets

## Database Configuration

Currently configured to use PostgreSQL via Neon. The schema has been successfully pushed to the database.

## Testing

The development server is running at `http://localhost:3000`. You can test the dashboard by:

1. Signing in to the application
2. Navigating to the dashboard
3. Seeing the empty state with guidance
4. Adding sample data or having a conversation with the AI
5. Watching the dashboard populate with real-time data