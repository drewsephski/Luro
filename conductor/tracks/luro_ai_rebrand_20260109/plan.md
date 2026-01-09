# Plan: Luro AI Rebrand & Core Directory

## Phase 1: Project Cleanup & Rebranding
- [x] Task: Update package.json metadata (name, version, description) to reflect Luro AI. 5e94198
- [ ] Task: Update root `layout.tsx` metadata (title: "Luro AI - The AI Tool Directory", description).
- [ ] Task: Generate and replace Logo and Favicon assets in `public/`.
- [ ] Task: Update `globals.css` to ensure the "Luro" color palette (Deep background, Purple accents) is consistent.
- [ ] Task: Clean up `app/(main)` to remove VoiceFlow specific dashboards, keeping a clean slate for the directory structure. (Preserve `components/ui`).
- [ ] Task: Conductor - User Manual Verification 'Project Cleanup & Rebranding' (Protocol in workflow.md)

## Phase 2: Database Schema & Backend
- [ ] Task: Define `Category` model in `prisma/schema.prisma`.
- [ ] Task: Define `Tool` model in `prisma/schema.prisma` with relations to Category.
- [ ] Task: Define `Review` model in `prisma/schema.prisma`.
- [ ] Task: Create a seed script `prisma/seed.ts` to populate initial Categories (LLMs, Image Gen, etc.) and 5-10 dummy Tools.
- [ ] Task: Run `prisma migrate dev` to apply changes and `prisma db seed` to populate data.
- [ ] Task: Conductor - User Manual Verification 'Database Schema & Backend' (Protocol in workflow.md)

## Phase 3: Core Directory UI
- [ ] Task: Create `getTools` and `getToolBySlug` server actions/functions to fetch data from Prisma.
- [ ] Task: Create a reusable `ToolCard` component (Name, Description, Rating, Category Badge).
- [ ] Task: Implement the Tools Listing page at `app/(main)/tools/page.tsx` displaying a grid of `ToolCards`.
- [ ] Task: Implement the Tool Detail page at `app/(main)/tool/[slug]/page.tsx` showing full details.
- [ ] Task: Conductor - User Manual Verification 'Core Directory UI' (Protocol in workflow.md)
