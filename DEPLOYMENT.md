# Railway Deployment Guide

This guide walks you through deploying the Retainer Generator to Railway.

## Prerequisites

- Railway account at https://railway.app
- GitHub repository (already created at aurelius1010/retainer-generator)

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `aurelius1010/retainer-generator`
5. Railway will automatically start building

### 2. Add PostgreSQL Database

1. In your project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway will provision a database and provide connection details

### 3. Configure Environment Variables

Go to your **App Service** → **Variables** tab and add:

```env
# Database (automatically provided by Railway PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Authentication (generate a secure 32+ character secret)
NEXTAUTH_SECRET=your-super-secure-secret-key-minimum-32-characters-long
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 4. Update Database Configuration

The app is already configured to work with PostgreSQL in production. Railway will automatically:
- Run `npm run build`
- Execute database migrations
- Start the application

### 5. Deploy

1. Railway will automatically deploy on every push to main
2. Monitor the build logs in the Railway dashboard
3. Once deployed, your app will be available at the Railway URL

### 6. First-Time Setup

After deployment:

1. Visit your Railway app URL
2. Create an admin account (first user becomes admin automatically)
3. Upload some document templates
4. Start creating retainer agreements!

## Custom Domain (Optional)

1. In Railway project → **Settings** → **Domains**
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable to your domain
4. Configure DNS records as shown in Railway

## Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Database**: PostgreSQL monitoring and backups

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | JWT signing secret (32+ chars) | Yes |
| `NEXTAUTH_URL` | Full URL of your app | Yes |
| `MAX_FILE_SIZE` | Max upload size in bytes | No (default: 10MB) |
| `UPLOAD_DIR` | File storage directory | No (default: ./uploads) |

## Troubleshooting

### Build Failures
- Check Railway build logs for specific errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check PostgreSQL service is running
- Ensure migrations ran successfully

### Authentication Problems
- Verify NEXTAUTH_SECRET is set and secure
- Check NEXTAUTH_URL matches your domain
- Ensure cookies are properly configured

### File Upload Issues
- Check UPLOAD_DIR permissions
- Verify MAX_FILE_SIZE setting
- Monitor disk space usage

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://railway.app/discord
- Project Issues: https://github.com/aurelius1010/retainer-generator/issues

## Cost Estimation

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month for small apps
- **Pro Plan**: Usage-based pricing
- **PostgreSQL**: Included in plans

The Retainer Generator should run comfortably on the Hobby plan for most use cases.