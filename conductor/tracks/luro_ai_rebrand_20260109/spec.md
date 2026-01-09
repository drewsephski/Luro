# Specification: Luro AI Rebrand & Core Directory

## Goal
Transform the existing "VoiceFlow" application into "Luro AI", a comprehensive AI tool directory. This involves a complete rebrand, database schema setup for tools and categories, and the implementation of the core directory UI.

## 1. Rebranding
- **Identity:** Update project name to "Luro AI".
- **Visuals:** Replace VoiceFlow logos and assets with Luro AI branded assets.
- **Metadata:** Update SEO metadata (title, description) in `layout.tsx` and `package.json`.
- **Cleanup:** Remove or archive VoiceFlow-specific pages that are not relevant to the directory (e.g., specific voice agent monitoring dashboards), while preserving reusable UI components.

## 2. Database Schema (Prisma)
- **Tool Model:**
    - `id`: String (UUID)
    - `name`: String
    - `slug`: String (unique)
    - `description`: String (short)
    - `overview`: String (long/markdown)
    - `websiteUrl`: String
    - `pricingModel`: String (Free, Freemium, Paid)
    - `tags`: String[]
    - `categoryId`: String (FK)
- **Category Model:**
    - `id`: String (UUID)
    - `name`: String (e.g., "Large Language Models")
    - `slug`: String (unique)
- **Review Model:**
    - `id`: String (UUID)
    - `rating`: Int (1-5)
    - `comment`: String
    - `userId`: String (Clerk ID)
    - `toolId`: String (FK)

## 3. Core Directory UI
- **Homepage (`/`):**
    - **Hero Section:** "Discover the best AI tools" with a search bar.
    - **Featured Categories:** Grid of top categories.
    - **Trending Tools:** Carousel or grid of highly-rated tools.
- **Tools Listing (`/tools`):**
    - Filterable grid of tools.
    - Sidebar or top bar for filtering by Category and Pricing.
- **Tool Detail (`/tool/[slug]`):**
    - **Header:** Logo, Name, Website Button, Rating.
    - **Overview:** "Intuitive Overview" section.
    - **Specs:** Technical details (if available).
    - **Similar Tools:** Recommendations.
