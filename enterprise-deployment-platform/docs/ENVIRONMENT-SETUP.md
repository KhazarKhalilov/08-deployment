# Environment Setup Guide

This document describes the environment configuration for development, testing, and production deployments.

## Environment Overview

The platform uses three distinct environments:

1. **Development** - Local development
2. **Staging** - Pre-production testing
3. **Production** - Live production environment

## Environment Variables

### Required Variables

#### All Environments
- `NODE_ENV` - Environment name (development, staging, production)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_APP_NAME` - Application name

#### Production Only
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking DSN
- `SENTRY_AUTH_TOKEN` - Sentry authentication token
- `SENTRY_ORG` - Sentry organization
- `SENTRY_PROJECT` - Sentry project name

### Optional Variables

- `DATABASE_URL` - Database connection string (if using database)
- `STRIPE_SECRET_KEY` - Stripe payment processing key
- `PAYMENT_GATEWAY_API_KEY` - Payment gateway API key
- `JWT_SECRET` - JWT signing secret
- `ENCRYPTION_KEY` - Data encryption key

## Development Environment

### Setup

1. Copy environment template:
   ```bash
   cp env.example .env.local
   ```

2. Configure variables:
   ```bash
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=Enterprise Platform (Dev)
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Features
- Hot module replacement
- Source maps enabled
- Verbose error messages
- Development dependencies included

## Staging Environment

### Setup

1. Configure in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add staging-specific variables

2. Environment variables:
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com
   NEXT_PUBLIC_APP_NAME=Enterprise Platform (Staging)
   NEXT_PUBLIC_SENTRY_DSN=your_staging_sentry_dsn
   ```

### Features
- Production-like configuration
- Preview deployments enabled
- Testing and QA validation
- Production data sanitized

## Production Environment

### Setup

1. Configure in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add production-specific variables

2. Environment variables:
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_NAME=Enterprise Platform
   NEXT_PUBLIC_SENTRY_DSN=your_production_sentry_dsn
   SENTRY_AUTH_TOKEN=your_sentry_auth_token
   SENTRY_ORG=your_sentry_org
   SENTRY_PROJECT=your_sentry_project
   ```

### Features
- Optimized builds
- Error tracking enabled
- Analytics enabled
- Custom domain with SSL
- Security headers enforced

## Secrets Management

### Best Practices

1. **Never commit secrets**
   - All `.env` files are in `.gitignore`
   - Use `env.example` for documentation

2. **Use Vercel Environment Variables**
   - Configure secrets in Vercel dashboard
   - Different secrets for each environment
   - Rotate secrets regularly

3. **Secret Rotation**
   - Rotate secrets every 90 days
   - Update all environments simultaneously
   - Document rotation process

### Secret Categories

#### Authentication Secrets
- `JWT_SECRET` - JWT signing secret
- `SESSION_SECRET` - Session encryption secret

#### Payment Secrets
- `STRIPE_SECRET_KEY` - Stripe API key
- `PAYMENT_GATEWAY_API_KEY` - Payment gateway key

#### Monitoring Secrets
- `SENTRY_AUTH_TOKEN` - Sentry authentication
- `SENTRY_DSN` - Sentry error tracking

#### Database Secrets
- `DATABASE_URL` - Database connection string
- `DB_PASSWORD` - Database password

## Environment-Specific Configuration

### Development
```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
# No production secrets needed
```

### Staging
```bash
# Vercel Environment Variables (Staging)
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.example.com
NEXT_PUBLIC_SENTRY_DSN=staging_dsn
```

### Production
```bash
# Vercel Environment Variables (Production)
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://example.com
NEXT_PUBLIC_SENTRY_DSN=production_dsn
SENTRY_AUTH_TOKEN=production_token
```

## Verification

### Check Environment Variables

```bash
# Development
npm run dev
# Check http://localhost:3000/api/health

# Production
# Check deployment URL/api/health
```

### Verify Secrets

1. Check Vercel dashboard for configured variables
2. Verify no secrets in codebase:
   ```bash
   grep -r "password\|secret\|key" --exclude-dir=node_modules
   ```

## Troubleshooting

### Missing Environment Variables

If environment variables are missing:
1. Check Vercel dashboard
2. Verify variable names match exactly
3. Check for typos in variable names
4. Ensure variables are set for correct environment

### Secrets Not Working

1. Verify secrets are configured in Vercel
2. Check secret values are correct
3. Ensure secrets are not expired
4. Verify environment-specific configuration

## Security Considerations

1. **Never log secrets** - Avoid logging sensitive values
2. **Use different secrets** - Each environment should have unique secrets
3. **Rotate regularly** - Update secrets periodically
4. **Limit access** - Only authorized personnel should have access
5. **Audit access** - Regularly review who has access to secrets

---

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>

