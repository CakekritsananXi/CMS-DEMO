# File Structure Documentation

## Project Overview
This is a modern React-based content planning platform built with TypeScript, Vite, and Tailwind CSS. The application provides comprehensive tools for content strategy, ideation, calendar management, and team collaboration.

## File Tree Structure

```
QuickPay Secure Content Planning Platform/
├── 📄 index.html                           🟢 Main HTML entry point
├── 📄 package.json                         🟢 Project dependencies and scripts
├── 📄 package-lock.json                    🟢 Dependency lock file
├── 📄 tsconfig.json                        🟢 TypeScript configuration root
├── 📄 tsconfig.app.json                    🟢 TypeScript app-specific config
├── 📄 tsconfig.node.json                   🟢 TypeScript Node.js config
├── 📄 vite.config.ts                       🟢 Vite build tool configuration
├── 📄 eslint.config.js                     🟢 ESLint linting configuration
├── 📄 postcss.config.js                    🟢 PostCSS configuration
├── 📄 tailwind.config.js                   🟢 Tailwind CSS configuration
├── 📄 .gitignore                           🟢 Git ignore patterns
├── 📁 src/
│   ├── 📄 main.tsx                         🟢 React application entry point
│   ├── 📄 App.tsx                          🟡 Main application component with routing
│   ├── 📄 index.css                        🟢 Global CSS styles and Tailwind imports
│   ├── 📄 vite-env.d.ts                    🟢 Vite environment type definitions
│   ├── 📁 pages/
│   │   ├── 📄 Dashboard.tsx                🟡 Main dashboard with stats and quick actions
│   │   ├── 📄 Calendar.tsx                 🟡 Editorial calendar with content scheduling
│   │   ├── 📄 Ideation.tsx                 🟡 Content ideation and brainstorming tools
│   │   ├── 📄 Strategy.tsx                 🟢 Content strategy and planning interface
│   │   ├── 📄 Library.tsx                  🟡 Content library and asset management
│   │   ├── 📄 Analytics.tsx                🟡 Content performance analytics
│   │   └── 📄 Collaboration.tsx            🟢 Team collaboration and project management
│   └── 📁 components/
│       ├── 📄 Navigation.tsx               🟡 Main navigation component with mobile support
│       ├── 📁 dashboard/
│       │   ├── 📄 QuickActions.tsx         🟡 Dashboard quick action buttons
│       │   ├── 📄 RecentActivity.tsx       🟢 Recent activity feed component
│       │   ├── 📄 ContentPillars.tsx       🟢 Content pillars progress display
│       │   └── 📄 UpcomingDeadlines.tsx    🟢 Upcoming deadlines widget
│       ├── 📁 calendar/
│       │   ├── 📄 CalendarGrid.tsx         🟡 Interactive calendar grid with drag-drop
│       │   └── 📄 ContentCard.tsx          🟡 Draggable content card component
│       ├── 📁 ideation/
│       │   ├── 📄 IdeaBoard.tsx            🟢 Idea management board interface
│       │   ├── 📄 IdeaCapture.tsx          🟡 Modal for capturing new ideas
│       │   └── 📄 TopicClusters.tsx        🟢 Topic clustering and organization
│       ├── 📁 strategy/
│       │   ├── 📄 ContentBriefs.tsx        🟢 Content brief management interface
│       │   ├── 📄 StrategicGoals.tsx       🟢 Strategic goals tracking component
│       │   └── 📄 ContentPillarsStrategy.tsx 🟢 Content pillar strategy management
│       ├── 📁 library/
│       │   ├── 📄 AssetGrid.tsx            🟢 Grid view for content assets
│       │   ├── 📄 AssetList.tsx            🟢 List view for content assets
│       │   └── 📄 FolderTree.tsx           🟢 Hierarchical folder navigation
│       ├── 📁 analytics/
│       │   ├── 📄 MetricsOverview.tsx      🟢 Key metrics overview cards
│       │   ├── 📄 ContentPerformance.tsx   🟢 Top performing content analysis
│       │   ├── 📄 ChannelAnalytics.tsx     🟢 Channel-specific performance metrics
│       │   └── 📄 PlanningInsights.tsx     🟢 AI-driven planning insights
│       └── 📁 collaboration/
│           ├── 📄 TeamMembers.tsx          🟢 Team member management interface
│           ├── 📄 RecentCollaboration.tsx  🟢 Recent collaboration activities
│           ├── 📄 SharedProjects.tsx       🟢 Shared project management
│           └── 📄 ActivityFeed.tsx         🟢 Real-time activity feed
```

## File Statistics
- **Total Files:** 42
- **Complexity Distribution:**
  - 🟢 Low Complexity (0-3 imports): 32 files (76%)
  - 🟡 Medium Complexity (4-7 imports): 10 files (24%)
  - 🔴 High Complexity (8+ imports): 0 files (0%)

## Architecture Patterns
- **Component Organization:** Feature-based directory structure
- **Styling:** Tailwind CSS with custom design system
- **State Management:** React hooks and context (no external state library)
- **Routing:** React Router v7 with declarative routing
- **Build Tool:** Vite for fast development and optimized builds
- **Type Safety:** Full TypeScript implementation
- **Code Quality:** ESLint configuration with React-specific rules