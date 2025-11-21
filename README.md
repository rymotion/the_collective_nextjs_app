# The Collective

A crowdfunding platform for independent filmmakers built with Next.js, React, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account ([sign up free](https://supabase.com))

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase Database
**📚 See detailed instructions:** [documentation/SUPABASE_SETUP.md](./documentation/SUPABASE_SETUP.md)

Quick steps:
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your API credentials
3. Update `.env` with your credentials
4. Run the database migration SQL

### 3. Configure Environment Variables
Create/update `.env` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Documentation

Complete documentation is available in the `/documentation` folder:

- **[SUPABASE_SETUP.md](./documentation/SUPABASE_SETUP.md)** - Complete Supabase setup guide with SQL migrations
- **[QUICK_START.md](./documentation/QUICK_START.md)** - Quick reference for developers
- **[DATABASE_SETUP.md](./documentation/DATABASE_SETUP.md)** - Database schema and service layer details
- **[IMPLEMENTATION_SUMMARY.md](./documentation/IMPLEMENTATION_SUMMARY.md)** - Technical implementation overview
- **[TESTING_GUIDE.md](./documentation/TESTING_GUIDE.md)** - Testing guidelines

## ✨ Features

- 🎬 **Project Discovery** - Browse and search independent film projects
- ✍️ **Create Pitch Workflow** - Multi-step form to pitch your screenplay
- 📝 **Draft & Publish** - Save drafts and publish when ready
- 👥 **Crew Invitations** - Invite team members directly via email
- 👤 **User Authentication** - Secure email/password authentication via Supabase
- 💰 **Crowdfunding** - Support filmmakers with contributions
- ⭐ **Favorites** - Save and track your favorite projects
- 🔍 **Advanced Search** - Full-text search with genre filtering
- 📱 **Responsive Design** - Optimized for all devices (mobile to 4K)
- 🌐 **Internationalization** - Multi-language support (English/Spanish)
- 🔒 **Row Level Security** - Secure database access with RLS policies

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Custom CSS with design system
- **Internationalization**: next-intl
- **Carousels**: Embla Carousel

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (available)
- **Storage**: Supabase Storage (ready to use)

### Services
- Complete CRUD service layer
- Type-safe database operations
- Authentication context with session management

## 📁 Project Structure

```
the-collective/
├── documentation/           # All documentation files
│   ├── SUPABASE_SETUP.md   # Supabase setup guide
│   ├── QUICK_START.md      # Quick reference
│   └── ...
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── services/           # Database service layer
│   │   ├── auth.service.ts
│   │   ├── projects.service.ts
│   │   ├── profiles.service.ts
│   │   ├── contributions.service.ts
│   │   └── favorites.service.ts
│   ├── context/            # React contexts
│   │   └── SupabaseAuthContext.tsx
│   ├── lib/                # Library configurations
│   │   └── supabase.ts
│   └── data/               # Mock data (for development)
├── .env                    # Environment variables (not in git)
├── package.json
└── README.md
```

## 🔧 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm test           # Run tests with coverage
npm run test:watch # Run tests in watch mode
npm run test:ci    # Run tests in CI mode
```

## 🗄️ Database Schema

The application uses 8 main tables:

1. **profiles** - User profiles with IMDb integration
2. **projects** - Film projects seeking funding (with draft/publish support)
3. **cast_crew** - Cast and crew members for projects
4. **accolades** - Awards and recognition
5. **contributions** - User funding contributions
6. **project_updates** - Project status updates
7. **favorites** - User-saved favorite projects
8. **crew_invitations** - Crew member invitations for projects

See [DATABASE_SETUP.md](./documentation/DATABASE_SETUP.md) and [CREATE_PITCH_WORKFLOW.md](./documentation/CREATE_PITCH_WORKFLOW.md) for complete schema details.

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Secure authentication via Supabase Auth
- Environment variables for sensitive data
- Type-safe database queries
- Input validation at service layer

## 🌍 Internationalization

The app supports multiple languages:
- English (en)
- Spanish (es)

Translation files are in `/messages/`

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1536px
- **Large Desktop**: > 1536px

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Contributing

Contributions are welcome! Please read the documentation first.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Having issues? Check these resources:
1. [SUPABASE_SETUP.md](./documentation/SUPABASE_SETUP.md) - Setup troubleshooting
2. [QUICK_START.md](./documentation/QUICK_START.md) - Common usage examples
3. [Supabase Documentation](https://supabase.com/docs)
4. [Next.js Documentation](https://nextjs.org/docs)

## ✅ Setup Checklist

- [ ] Cloned repository
- [ ] Ran `npm install`
- [ ] Created Supabase project
- [ ] Updated `.env` with Supabase credentials
- [ ] Ran database migration SQL
- [ ] Started dev server with `npm run dev`
- [ ] Created test user account
- [ ] Verified database connection

---

Built with ❤️ using Next.js and Supabase
