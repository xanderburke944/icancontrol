# i10 Group Portal

A modern web application for managing group practice operations, including practices directory, file ageing analysis, and month-end protocols.

## Project Structure

```
i10-group-portal/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout with Sidebar
│   │   ├── page.tsx                 # Dashboard Overview
│   │   ├── practices/
│   │   │   └── page.tsx             # Practices directory
│   │   ├── ageing/
│   │   │   └── page.tsx             # Age Analysis
│   │   ├── protocols/
│   │   │   └── page.tsx             # Protocols & SOPs
│   │   └── globals.css              # Global Tailwind styles
│   ├── components/
│   │   ├── Sidebar.tsx              # Navigation
│   │   ├── PracticeTable.tsx        # Practices list display
│   │   ├── AgeingTracker.tsx        # Age analysis display
│   │   └── ProtocolCard.tsx         # Protocol card component
│   └── lib/
│       └── supabaseClient.ts        # Supabase initialization
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
├── .eslintrc.json                    # ESLint config
└── .gitignore                        # Git ignore rules
```

## Tech Stack

- **Framework**: Next.js 15+ with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features

### Dashboard
- Overview of total practices and pending claims
- Urgent follow-ups display
- Recent activity feed

### Practices Module
- Directory view of all practices
- Create, edit, and delete practices
- Practice status tracking

### Ageing Module
- File age analysis
- Claims tracking with age categories
- Follow-up management

### Protocols Module
- Month-end protocol repository
- SOP documentation
- Protocol categorization and search

## Development

The application uses:
- Server components by default for better performance
- Client components where interactivity is needed (marked with `'use client'`)
- TypeScript for type safety
- Tailwind CSS for styling

## Next Steps

1. Connect Supabase database and create schema
2. Implement data fetching from Supabase
3. Add authentication
4. Create modals and forms for CRUD operations
5. Add data validation
6. Deploy to Vercel

---

Built with the i10 Portal Full-Stack Developer agent 🚀
# icancontrol
