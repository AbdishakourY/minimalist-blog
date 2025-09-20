# 📝 Minimalist Blog Platform

Hey there 👋 and welcome!  
This is a little **side project** I built while I was traveling ✈️.  
I got to the airport way too early, got bored, and instead of doom-scrolling Instagram, I decided to spin up a minimalistic blogging platform. So here it is: **a clean, minimalist blog with an admin dashboard**.  

Built with ❤️ using:
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Backend:** Node.js + Express + MongoDB
- **Database:** MongoDB Atlas
- **Deployment:** Vercel (frontend) & Render (backend)

## 🚀 Features
- Browse published blog posts
- View single posts by slug
- Search & filter posts by tags
- Password-protected admin dashboard
- Create, edit, delete posts
- Responsive, minimalist design
- Deployed and ready to go

## 📂 Project Structure
```bash
.
├── app/               # Next.js App Router pages (frontend)
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Frontend API client
├── public/            # Static assets
├── styles/            # Global & module CSS

├── backend/           # Express backend
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Middlewares (validation, auth, etc.)
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   ├── scripts/       # Utility scripts
│   └── utils/         # Helper functions
│
├── server.js          # Main backend entrypoint
├── server-test.js     # Test server (local/dev)
└── README.md
