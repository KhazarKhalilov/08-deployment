# Contributing Guide

Thank you for your interest in contributing to the Enterprise Deployment Platform!

## Development Workflow

### 1. Setup

```bash
# Clone the repository
git clone <repository-url>
cd enterprise-deployment-platform

# Install dependencies
npm ci

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration
```

### 2. Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

### 3. Making Changes

1. Create a feature branch from `dev`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Ensure tests pass:
   ```bash
   npm test
   ```

4. Ensure linting passes:
   ```bash
   npm run lint
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

6. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request

### 4. Pull Request Process

- A preview deployment will be automatically created
- CI/CD pipeline will run automatically
- Ensure all checks pass
- Request review from team members
- Address review feedback
- Once approved, merge to `dev` branch

### 5. Deployment

- Merging to `dev` triggers staging deployment
- Merging to `main` triggers production deployment

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types
- Use interfaces for object types
- Use enums for constants

### React Components

- Use functional components with hooks
- Use TypeScript for component props
- Keep components small and focused
- Extract reusable logic into custom hooks

### Testing

- Write tests for new features
- Maintain minimum 70% test coverage
- Use React Testing Library for component tests
- Use Jest for unit tests

### Code Style

- Follow ESLint rules
- Use Prettier for formatting (if configured)
- Write descriptive commit messages
- Add comments for complex logic

## Commit Message Format

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add product search functionality
fix: resolve image loading issue
docs: update deployment guide
```

## Questions?

If you have questions, please open an issue or contact the maintainers.

Thank you for contributing! 🎉

