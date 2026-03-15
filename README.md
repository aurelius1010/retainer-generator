# Retainer Generator

A complete Next.js application for generating professional retainer agreements. Built with modern web technologies and ready for both local development and production deployment.

## Features

- 🔐 **User Authentication** - Secure login/register system with JWT tokens
- 📄 **Document Upload** - Support for .doc, .docx, and .pdf files with text extraction
- 👥 **Client Management** - Full CRUD operations for client information
- 📋 **Template System** - Create and manage reusable retainer templates
- 📊 **Retainer Creation** - Generate retainers with dynamic placeholders
- 📤 **Document Export** - Export retainers as PDF or Word documents
- 📈 **Admin Dashboard** - Clean, modern interface with statistics
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma 5.22.0
- **Authentication**: JWT with HTTP-only cookies
- **File Processing**: Mammoth.js for .docx text extraction
- **Document Generation**: jsPDF and docx.js
- **UI Components**: Custom components with Tailwind CSS
- **File Uploads**: React Dropzone with multer

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aurelius1010/retainer-generator.git
   cd retainer-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client and run migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Configure environment variables**
   
   The `.env` file is already configured for local development with SQLite:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR="./uploads"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:3000 in your browser
   - Login with the default admin account:
     - Email: `admin@example.com`
     - Password: `admin123`

## Database Schema

### Core Models

- **Users**: Authentication and user management
- **Clients**: Client information and contact details  
- **Templates**: Reusable retainer agreement templates
- **Retainers**: Generated retainer agreements
- **UploadedDocuments**: File uploads with metadata

### Key Features

- SQLite for development (fast setup, no external dependencies)
- PostgreSQL configuration ready for production
- Automatic foreign key constraints and cascading deletes
- Comprehensive indexing for performance

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client details
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

### Templates
- `GET /api/templates` - List all templates
- `POST /api/templates` - Create new template

### Retainers
- `GET /api/retainers` - List all retainers
- `POST /api/retainers` - Create new retainer
- `GET /api/retainers/[id]/export?format=pdf|docx` - Export retainer

### File Upload
- `POST /api/upload` - Upload documents

## Document Templates

The system uses dynamic placeholders that are replaced when generating retainers:

- `{{CLIENT_NAME}}` - Client's full name
- `{{CLIENT_EMAIL}}` - Client's email address
- `{{CLIENT_COMPANY}}` - Client's company name
- `{{CLIENT_ADDRESS}}` - Client's address
- `{{CLIENT_PHONE}}` - Client's phone number
- `{{RETAINER_FEE}}` - Formatted retainer fee amount
- `{{MONTHLY_FEE}}` - Formatted monthly fee amount
- `{{EXPENSES}}` - Formatted expense amount
- `{{TERMS}}` - Custom terms and conditions
- `{{LENGTH}}` - Agreement length/duration
- `{{START_DATE}}` - Agreement start date
- `{{END_DATE}}` - Agreement end date
- `{{CUSTOM_CONTENT}}` - Additional custom content
- `{{CURRENT_DATE}}` - Current date when generated

## Development

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── forms/            # Form components
└── lib/                  # Utility functions
    ├── auth.ts           # Authentication helpers
    ├── db.ts             # Database connection
    ├── document-generator.ts # PDF/DOCX generation
    └── utils.ts          # General utilities
```

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run migrations
2. **API Routes**: Add new endpoints in `src/app/api/`
3. **UI Components**: Create reusable components in `src/components/`
4. **Pages**: Add new pages in `src/app/dashboard/`

## Production Deployment

### Railway Deployment

Railway provides easy deployment for full-stack applications with database support.

#### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code

#### Step 1: Prepare for Production

1. **Update environment variables for production**:
   ```env
   # Replace SQLite with PostgreSQL for production
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # Generate a secure secret key
   NEXTAUTH_SECRET="your-super-secure-secret-key-minimum-32-characters"
   
   # Update URL for your domain
   NEXTAUTH_URL="https://your-app-name.railway.app"
   
   # File upload settings
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR="./uploads"
   ```

2. **Update Prisma schema for PostgreSQL**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

#### Step 2: Deploy to Railway

1. **Connect Repository**:
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your retainer-generator repository

2. **Add PostgreSQL Database**:
   - In your Railway project, click "New Service"
   - Select "PostgreSQL"
   - Railway will automatically provide DATABASE_URL

3. **Configure Environment Variables**:
   - Go to your app service settings
   - Add all environment variables from step 1
   - Use the DATABASE_URL provided by Railway's PostgreSQL service

4. **Deploy**:
   - Railway will automatically detect it's a Next.js app
   - Build command: `npm run build`
   - Start command: `npm start`
   - The app will deploy automatically

#### Step 3: Post-Deployment Setup

1. **Run Database Migrations**:
   ```bash
   # Railway will run this automatically, or you can trigger manually
   npx prisma migrate deploy
   ```

2. **Seed Production Database** (optional):
   ```bash
   # SSH into Railway container or run locally with production DATABASE_URL
   npm run db:seed
   ```

#### Step 4: Custom Domain (Optional)

1. In Railway project settings, go to "Domains"
2. Add your custom domain
3. Update NEXTAUTH_URL environment variable

### Alternative Deployment Options

#### Vercel
- Perfect for Next.js apps
- Add Vercel PostgreSQL or connect external database
- Set environment variables in Vercel dashboard

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Features

- ✅ HTTP-only JWT cookies (no localStorage)
- ✅ Password hashing with bcrypt
- ✅ SQL injection protection via Prisma
- ✅ File upload validation and size limits
- ✅ User data isolation (users can only access their own data)
- ✅ Secure file handling and storage

## File Upload Security

- **File Type Validation**: Only .pdf, .doc, and .docx files allowed
- **File Size Limits**: 10MB maximum per file
- **Secure Storage**: Files stored in uploads directory with unique names
- **Metadata Tracking**: All uploads logged in database with user association

## Performance Features

- ⚡ Static page generation where possible
- ⚡ Efficient database queries with Prisma
- ⚡ Image optimization with Next.js
- ⚡ Turbopack for fast development builds
- ⚡ SQLite for fast local development

## Browser Support

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/aurelius1010/retainer-generator/issues)
- Documentation: Check this README and code comments

## Changelog

### v1.0.0 (Initial Release)
- Complete retainer generation system
- User authentication and authorization
- Client and template management
- Document upload and text extraction
- PDF and Word document export
- Responsive admin dashboard
- SQLite development setup
- PostgreSQL production ready
- Railway deployment guide