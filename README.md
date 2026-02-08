# SocialCue – Connect IRL

Meet new people and find activity partners offline. Real connections, real life.

## Features

- **Intro Flow**: Name, age, gender, location
- **AI Chatbot**: Gemini-powered chat to learn interests, likes/dislikes
- **Profile Creation**: AI extracts keywords and builds your profile
- **Meet New People**: Match by similar interests or "Surprise Me" for random connections
- **Activities**: Find people who want to play tennis, basketball, etc. right now
- **Community Service**: Coming soon

## Tech Stack

- Next.js 15 (App Router)
- PostgreSQL + Prisma
- Gemini API (Google AI)
- shadcn/ui + Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/apikey)

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/intro` | Basic info form |
| `/chat` | AI chatbot for interests |
| `/profile` | Profile view after creation |
| `/categories` | Meet People, Activities, Community |
| `/meet` | Meet new people (similar interests / Surprise Me) |
| `/meet/connected` | Connection success |
| `/activities` | Sports selection |
| `/activities/connected` | Activity match success |
| `/community` | Coming soon |

## Deployment (DigitalOcean)

1. Create a PostgreSQL database on DigitalOcean
2. Set environment variables in your app platform
3. Deploy with `npm run build` and `npm start`

## License

MIT
