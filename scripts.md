# Scripts Documentation

## Available Scripts Reference

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `npm run dev` | Starts the Vite development server with hot module replacement | `--port <number>` (optional)<br>`--host <string>` (optional) | `npm run dev`<br>`npm run dev -- --port 3000`<br>`npm run dev -- --host 0.0.0.0` | **Port already in use**: Change port with `--port` flag<br>**Network access needed**: Use `--host 0.0.0.0`<br>**Slow startup**: Clear node_modules and reinstall |
| `npm run build` | Creates optimized production build in `dist/` directory | None | `npm run build` | **TypeScript errors**: Fix type errors before building<br>**Out of memory**: Increase Node.js memory with `NODE_OPTIONS=--max-old-space-size=4096`<br>**Build fails**: Check for unused imports and circular dependencies |
| `npm run preview` | Serves the production build locally for testing | `--port <number>` (optional)<br>`--host <string>` (optional) | `npm run preview`<br>`npm run preview -- --port 4173` | **Build not found**: Run `npm run build` first<br>**Assets not loading**: Check base URL configuration<br>**404 errors**: Verify routing configuration |
| `npm run lint` | Runs ESLint to check code quality and style | `--fix` (optional)<br>`--ext <extensions>` (optional) | `npm run lint`<br>`npm run lint -- --fix`<br>`npm run lint -- --ext .ts,.tsx` | **Parsing errors**: Check ESLint configuration<br>**Rule conflicts**: Review eslint.config.js<br>**Performance issues**: Add file/directory exclusions |
| `npm run type-check` | Runs TypeScript compiler for type checking without emitting files | `--noEmit` (included)<br>`--incremental` (optional) | `npm run type-check` | **Type errors**: Fix TypeScript issues in reported files<br>**Slow checking**: Use `--incremental` flag<br>**Memory issues**: Increase TypeScript memory limit |

## Detailed Script Explanations

### Development Server (`npm run dev`)

**Purpose**: Starts the Vite development server with hot module replacement for rapid development.

**Features**:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Source map support
- Automatic browser opening
- File watching and live reload

**Configuration**: Controlled by `vite.config.ts`

**Expected Output**:
```bash
  VITE v5.4.2  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Common Issues**:
- **EADDRINUSE Error**: Port 5173 is already in use
  - Solution: `npm run dev -- --port 3000`
- **Module not found**: Clear cache with `rm -rf node_modules/.vite`
- **Slow HMR**: Check for large files or circular dependencies

### Production Build (`npm run build`)

**Purpose**: Creates an optimized production build with minification, tree-shaking, and asset optimization.

**Build Process**:
1. TypeScript compilation
2. Asset optimization
3. Code splitting
4. Minification
5. Source map generation (optional)

**Output Directory**: `dist/`

**Expected Output**:
```bash
vite v5.4.2 building for production...
✓ 34 modules transformed.
dist/index.html                  0.46 kB │ gzip:  0.30 kB
dist/assets/index-DiwrgTda.css   8.15 kB │ gzip:  2.34 kB
dist/assets/index-BNtVkKrw.js  143.67 kB │ gzip: 46.13 kB
✓ built in 1.23s
```

**Performance Optimization**:
- Automatic code splitting
- Tree shaking for unused code
- Asset compression
- CSS optimization

### Preview Server (`npm run preview`)

**Purpose**: Serves the production build locally to test the optimized version before deployment.

**Use Cases**:
- Testing production build locally
- Verifying asset loading
- Performance testing
- Final QA before deployment

**Requirements**: Must run `npm run build` first

### Code Quality (`npm run lint`)

**Purpose**: Analyzes code for potential errors, style issues, and best practice violations.

**ESLint Configuration**: `eslint.config.js`

**Rules Enforced**:
- React hooks rules
- TypeScript best practices
- Import/export conventions
- Code formatting standards

**Auto-fix Capability**: Many issues can be automatically fixed with `--fix` flag

**Integration**: 
- Pre-commit hooks (recommended)
- CI/CD pipeline integration
- IDE integration for real-time feedback

### Type Checking (`npm run type-check`)

**Purpose**: Validates TypeScript types without generating JavaScript output.

**Benefits**:
- Catch type errors early
- Ensure type safety
- Validate interface contracts
- Check generic constraints

**Configuration**: Uses `tsconfig.json` settings

**Performance Tips**:
- Use incremental compilation
- Exclude unnecessary files
- Optimize TypeScript configuration

## Script Combinations and Workflows

### Development Workflow
```bash
# Start development
npm run dev

# In separate terminal - continuous type checking
npm run type-check -- --watch

# Before committing
npm run lint -- --fix
npm run type-check
```

### Pre-deployment Workflow
```bash
# Build and test
npm run build
npm run preview

# Quality checks
npm run lint
npm run type-check
```

### CI/CD Pipeline Scripts
```bash
# Install dependencies
npm ci

# Quality gates
npm run lint
npm run type-check

# Build
npm run build

# Optional: Preview test
npm run preview &
# Run e2e tests against preview server
```

## Environment-Specific Configurations

### Development
- Source maps enabled
- Hot reload active
- Debug information available
- Unminified code

### Production
- Code minification
- Asset optimization
- Source maps optional
- Performance optimized

### Testing
- Test-specific builds
- Coverage reporting
- Mock configurations
- Isolated environments

## Troubleshooting Guide

### Common Build Issues

**Memory Issues**:
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Dependency Issues**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Issues**:
```bash
# Check configuration
npx tsc --showConfig

# Incremental build cleanup
rm -rf node_modules/.cache
```

### Performance Optimization

**Slow Development Server**:
- Exclude large directories from file watching
- Use `--host 0.0.0.0` only when needed
- Check for circular dependencies

**Large Bundle Size**:
- Analyze bundle with `npm run build -- --analyze`
- Implement code splitting
- Remove unused dependencies

**Slow Type Checking**:
- Use project references
- Enable incremental compilation
- Exclude test files from main build