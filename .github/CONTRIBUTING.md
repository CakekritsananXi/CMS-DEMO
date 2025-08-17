# Contributing to ContentFlow

Thank you for your interest in contributing to ContentFlow! This document provides guidelines and information for contributors.

## 🎯 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git latest version
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/contentflow.git
   cd contentflow
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-org/contentflow.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Verify setup**
   - Open http://localhost:5173
   - Ensure the application loads without errors
   - Check browser console for any warnings

## 📋 How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots/recordings if applicable
   - Console errors or stack traces

### Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Provide comprehensive details**:
   - Clear problem statement
   - Proposed solution
   - User stories and acceptance criteria
   - Business impact and value proposition

### Contributing Code

#### Branch Naming Convention
```
[type]/[ticket-number]-[short-description]

Examples:
feature/CF-123-add-calendar-view
bugfix/CF-456-fix-navigation-mobile
hotfix/CF-789-security-patch
chore/CF-101-update-dependencies
docs/CF-202-update-readme
```

#### Commit Message Format
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

Examples:
feat(calendar): add drag and drop functionality
fix(navigation): resolve mobile menu toggle issue
docs(readme): update installation instructions
style(components): improve button hover states
refactor(utils): optimize date formatting functions
test(calendar): add unit tests for date utilities
chore(deps): update React to v18.3.1
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/CF-123-add-calendar-view
   ```

2. **Make your changes**
   - Follow the coding standards (see below)
   - Write/update tests as needed
   - Update documentation if required

3. **Test your changes**
   ```bash
   npm run lint          # Check code style
   npm run type-check    # Verify TypeScript
   npm test              # Run tests
   npm run build         # Ensure build works
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(calendar): add drag and drop functionality"
   ```

5. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push your branch**
   ```bash
   git push origin feature/CF-123-add-calendar-view
   ```

7. **Create a Pull Request**
   - Use the PR template
   - Fill out all required sections
   - Link related issues
   - Add screenshots for UI changes

## 📝 Coding Standards

### TypeScript Guidelines

#### File Naming
- **Components**: PascalCase (`ContentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useContentData.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types**: PascalCase with `.types.ts` suffix (`Content.types.ts`)

#### Component Structure
```typescript
// 1. Imports (external first, then internal)
import React, { useState, useEffect } from 'react';
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
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Event handlers
  const handleClick = () => {
    setIsActive(!isActive);
    onAction();
  };
  
  // 7. Render
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

#### TypeScript Best Practices
- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Use union types for string literals
- Avoid `any` type - use `unknown` if necessary
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Implement proper error boundaries

### CSS/Styling Guidelines

#### Tailwind CSS Best Practices
- Use semantic class ordering: layout → spacing → typography → colors → effects
- Prefer utility classes over custom CSS
- Use component-specific classes for complex styling
- Follow mobile-first responsive design

#### Class Ordering Example
```jsx
<div className="
  flex flex-col          // Layout
  p-4 m-2               // Spacing
  text-lg font-medium   // Typography
  text-gray-900 bg-white // Colors
  rounded-lg shadow-md  // Effects
  hover:shadow-lg       // Interactive states
  md:flex-row md:p-6    // Responsive
">
```

#### Custom CSS Guidelines
- Use CSS modules for component-specific styles
- Follow BEM methodology for class naming
- Prefer CSS custom properties for theming
- Ensure accessibility (focus states, contrast ratios)

### React Best Practices

#### Component Guidelines
- Use functional components with hooks
- Implement proper prop validation with TypeScript
- Use React.memo() for performance optimization when needed
- Handle loading and error states appropriately
- Implement proper cleanup in useEffect

#### State Management
- Use local state for component-specific data
- Use context for shared state across components
- Consider state colocation (keep state close to where it's used)
- Use reducers for complex state logic

#### Performance Considerations
- Implement lazy loading for routes and heavy components
- Use useMemo() and useCallback() judiciously
- Optimize re-renders with proper dependency arrays
- Implement virtual scrolling for large lists

### Accessibility Standards

#### WCAG 2.1 AA Compliance
- Provide alternative text for images
- Ensure keyboard navigation works
- Maintain proper color contrast ratios
- Use semantic HTML elements
- Implement ARIA labels where necessary
- Test with screen readers

#### Implementation Checklist
- [ ] Semantic HTML structure
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast meets standards
- [ ] Alternative text for images
- [ ] ARIA labels for complex interactions
- [ ] Screen reader compatibility tested

## 🧪 Testing Guidelines

### Testing Strategy
- **Unit Tests**: Individual functions and components
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: WCAG compliance
- **Performance Tests**: Load times and responsiveness

### Writing Tests
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentCard } from './ContentCard';

describe('ContentCard', () => {
  it('should render content title', () => {
    render(<ContentCard title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<ContentCard title="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Requirements
- Maintain minimum 80% code coverage
- Test happy paths and edge cases
- Mock external dependencies
- Use descriptive test names
- Group related tests with `describe` blocks

## 📚 Documentation Standards

### Code Documentation
- Use JSDoc comments for functions and classes
- Document complex algorithms and business logic
- Include examples in documentation
- Keep comments up-to-date with code changes

### README Updates
- Update installation instructions if dependencies change
- Document new environment variables
- Add examples for new features
- Update troubleshooting section as needed

## 🔍 Code Review Process

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] Accessibility guidelines followed
- [ ] Performance impact considered

### Review Criteria
- **Functionality**: Does it work as expected?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Any negative impact?
- **Security**: Are there any vulnerabilities?
- **Accessibility**: Does it meet WCAG standards?
- **Testing**: Are tests comprehensive?
- **Documentation**: Is it properly documented?

### Review Process
1. **Automated Checks**: CI pipeline must pass
2. **Peer Review**: At least 2 approving reviews required
3. **Testing**: Manual testing on different devices/browsers
4. **Final Approval**: Maintainer approval before merge

## 🚀 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow
1. **Feature Freeze**: No new features for release branch
2. **Testing**: Comprehensive testing on staging environment
3. **Documentation**: Update changelog and documentation
4. **Release**: Create release tag and deploy to production
5. **Post-Release**: Monitor for issues and hotfixes

## 🆘 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Slack**: Real-time communication (invite required)
- **Email**: security@contentflow.com (security issues only)

### Resources
- [Project Wiki](https://github.com/your-org/contentflow/wiki)
- [API Documentation](https://api.contentflow.com/docs)
- [Design System](https://design.contentflow.com)
- [Deployment Guide](https://docs.contentflow.com/deployment)

## 🙏 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Annual contributor appreciation post
- Special recognition for first-time contributors

Thank you for contributing to ContentFlow! Your efforts help make this project better for everyone. 🎉