# ContentFlow - Modern Content Planning Platform

A comprehensive content planning and strategy platform built with React, TypeScript, and modern web technologies. ContentFlow helps teams ideate, plan, schedule, and analyze their content strategy with powerful collaboration tools.

## 🚀 Features

- **📊 Dashboard**: Comprehensive overview with key metrics and quick actions
- **📅 Editorial Calendar**: Visual content scheduling with drag-and-drop functionality
- **💡 Ideation Hub**: Capture and organize content ideas with topic clustering
- **🎯 Strategy Planning**: Define content pillars and strategic goals
- **📚 Content Library**: Organize assets, templates, and resources
- **📈 Analytics**: Track content performance and gain insights
- **👥 Team Collaboration**: Project management and real-time collaboration

## 🛠 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5.4+
- **Styling**: Tailwind CSS 3.4+
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Drag & Drop**: React DND
- **Date Handling**: date-fns
- **Code Quality**: ESLint + TypeScript ESLint

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn 1.22.0+)
- **Git**: Latest version
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/contentflow.git
cd contentflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
VITE_APP_NAME=ContentFlow
VITE_API_URL=http://localhost:3001
VITE_ENVIRONMENT=development
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Development

### Code Style & Conventions

#### File Naming
- **Components**: PascalCase (`ContentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useContentData.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

#### Component Structure
```typescript
// 1. Imports (external libraries first, then internal)
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 4. State and hooks
  const [isActive, setIsActive] = useState(false);
  
  // 5. Event handlers
  const handleClick = () => {
    setIsActive(!isActive);
    onAction();
  };
  
  // 6. Render
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

#### CSS Classes (Tailwind)
- Use semantic class ordering: layout → spacing → typography → colors → effects
- Prefer component-specific classes over global utilities
- Use custom CSS variables for consistent theming

### Git Workflow

#### Branch Naming Convention
```
[type]/[ticket-number]-[short-description]

Examples:
feature/CP-123-add-calendar-view
bugfix/CP-456-fix-navigation-mobile
hotfix/CP-789-security-patch
chore/CP-101-update-dependencies
```

#### Commit Messages
Follow conventional commits:
```
type(scope): description

feat(calendar): add drag and drop functionality
fix(navigation): resolve mobile menu toggle issue
docs(readme): update installation instructions
style(components): improve button hover states
refactor(utils): optimize date formatting functions
test(calendar): add unit tests for date utilities
chore(deps): update React to v18.3.1
```

### Pull Request Template

```markdown
## 📝 Description
Brief description of changes and motivation.

## 🔄 Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## 🧪 Testing Steps
1. Step one
2. Step two
3. Step three

## 📸 Screenshots
<!-- Add screenshots for UI changes -->

## ✅ Review Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Accessibility guidelines followed
```

### Code Review Criteria

#### Must Have ✅
- [ ] Functionality works as expected
- [ ] No TypeScript errors or warnings
- [ ] Responsive design (mobile-first approach)
- [ ] Accessibility standards (WCAG 2.1 AA)
- [ ] Performance considerations (lazy loading, memoization)
- [ ] Error handling and edge cases
- [ ] Consistent with design system

#### Nice to Have 🎯
- [ ] Code optimization opportunities
- [ ] Reusable component extraction
- [ ] Performance improvements
- [ ] Enhanced user experience

## 🚀 Deployment

### Development Environment
```bash
npm run dev
```
- Hot reload enabled
- Source maps available
- Development-specific error boundaries

### Staging Environment
```bash
npm run build:staging
npm run preview
```
- Production build with staging API endpoints
- Performance monitoring enabled
- Feature flags for testing

### Production Environment
```bash
npm run build
npm run preview
```
- Optimized production build
- Asset compression and minification
- CDN-ready static assets

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_APP_NAME` | Application name | Yes | ContentFlow |
| `VITE_API_URL` | Backend API URL | Yes | - |
| `VITE_ENVIRONMENT` | Environment type | Yes | development |
| `VITE_ANALYTICS_ID` | Analytics tracking ID | No | - |
| `VITE_SENTRY_DSN` | Error tracking DSN | No | - |

### Deployment Checklist

#### Pre-deployment
- [ ] All tests passing
- [ ] Build successful without warnings
- [ ] Environment variables configured
- [ ] Database migrations completed (if applicable)
- [ ] Third-party service configurations updated

#### Post-deployment
- [ ] Application loads successfully
- [ ] Core functionality verified
- [ ] Performance metrics within acceptable range
- [ ] Error monitoring active
- [ ] Rollback plan confirmed

### Rollback Procedures

#### Quick Rollback (< 5 minutes)
1. Revert to previous deployment
2. Clear CDN cache if applicable
3. Verify application functionality
4. Monitor error rates

#### Full Rollback (Database changes)
1. Stop application traffic
2. Restore database backup
3. Deploy previous application version
4. Verify data integrity
5. Resume traffic gradually

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |
| `npm run lint:fix` | Fix auto-fixable ESLint issues |
| `npm run type-check` | Run TypeScript type checking |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-org/contentflow/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/contentflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/contentflow/discussions)
- **Email**: support@contentflow.com

## 🙏 Acknowledgments

- Design inspiration from modern content management platforms
- Icons provided by [Lucide](https://lucide.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)