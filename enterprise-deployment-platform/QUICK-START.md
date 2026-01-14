# Quick Start Guide

## Project Purpose

This project is designed to deploy an **Enterprise-level E-commerce Platform** in a production-ready manner. The project includes the following main components:

1. **Production-Ready Platform**: E-commerce platform built with Next.js 14
2. **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions
3. **Docker Containerization**: Optimized Docker image for production
4. **Performance Monitoring**: Vercel Analytics, Speed Insights, Sentry
5. **Security & Compliance**: Enterprise-level security measures

## 🎯 Testing Steps

### Step 1: Install Dependencies

```bash
cd enterprise-deployment-platform
npm ci
```

### Step 2: Start Development Server

```bash
npm run dev
```

Open in browser: `http://localhost:3000`

**What you should see:**
- ✅ Homepage loads
- ✅ "Enterprise E-commerce Platform" title appears
- ✅ Product list appears
- ✅ No errors

### Step 3: Run Tests

```bash
npm test
```

**Expected result:**
```
PASS  __tests__/api/health.test.ts
  /api/health
    ✓ should return healthy status (XX ms)
    ✓ should return valid timestamp (XX ms)
    ✓ should return environment information (XX ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

### Step 4: Build Test

```bash
npm run build
```

**Expected result:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

### Step 5: Production Server Test

```bash
npm start
```

Open in browser: `http://localhost:3000` and verify everything works.

## 🐳 Docker Testing

### Build Docker Image

```bash
docker build -t enterprise-platform .
```

### Run Container

```bash
docker-compose up -d
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "environment": "production",
  "version": "1.0.0"
}
```

## 🔄 CI/CD Testing

### GitHub Actions Test

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "test: initial commit"
   git push origin main
   ```

2. **Check on GitHub:**
   - Go to "Actions" tab in your repository
   - Wait for workflow run
   - Verify all stages pass

## 📊 Essential Test Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run type-check` | Check TypeScript errors |

## ✅ Test Checklist

- [ ] Dependencies installed (`npm ci`)
- [ ] Development server running (`npm run dev`)
- [ ] Tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Production server running (`npm start`)
- [ ] Docker image built
- [ ] Docker container running
- [ ] Health endpoint responding

## 🎓 What We Learned?

With this project:

1. ✅ **Production Deployment**: Learned to deploy on Vercel
2. ✅ **CI/CD Pipeline**: Created automated workflow with GitHub Actions
3. ✅ **Docker**: Applied containerization techniques
4. ✅ **Monitoring**: Set up performance and error tracking
5. ✅ **Security**: Implemented enterprise-level security measures

## 📚 Additional Resources

- [README.md](./README.md) - Complete documentation
- [DEPLOYMENT-INSIGHTS.md](./DEPLOYMENT-INSIGHTS.md) - Engineering insights
- [QUICK-START-AZ.md](./QUICK-START-AZ.md) - Azerbaijani quick start guide

---

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>

