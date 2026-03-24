# Quick Reference Guide

## 📁 Project File Structure

```
rag/
├── .editorconfig                           # Code formatting rules
├── .gitignore                              # Git ignore patterns
├── .github/                                # GitHub configuration
│   ├── CHANGELOG.md                        # Version history
│   ├── CONTRIBUTING.md                     # Contributing guidelines
│   ├── copilot-instructions.md             # Project instructions
│   ├── pull_request_template.md            # PR template
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                   # Bug report form
│   │   └── feature_request.md              # Feature request form
│   └── workflows/
│       └── deploy.yml                      # CI/CD pipeline
├── docs/
│   ├── SETUP.md                            # Quick setup (5 min)
│   └── TEMPLATE_GUIDE.md                   # Template usage
├── backend/
│   ├── app/
│   │   ├── main.py                         # FastAPI routes
│   │   ├── auth.py                         # Auth logic
│   │   ├── models.py                       # DB models
│   │   ├── schemas.py                      # Pydantic models
│   │   ├── config.py                       # Settings
│   │   └── database.py                     # DB connection
│   ├── requirements.txt                    # Python dependencies
│   └── app.db                              # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx                  # Main layout
│   │   │   ├── Layout.css                  # Layout styles
│   │   │   ├── AuthForm.tsx                # Auth component
│   │   │   └── ProtectedRoute.tsx          # Route guard
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx               # Login page
│   │   │   ├── RegisterPage.tsx            # Registration page
│   │   │   └── DashboardPage.tsx           # Dashboard page
│   │   ├── auth/
│   │   │   └── AuthContext.tsx             # Auth state
│   │   ├── api.ts                          # API client
│   │   ├── App.tsx                         # Routes
│   │   └── main.tsx                        # Entry point
│   ├── package.json                        # NPM config
│   ├── tsconfig.json                       # TypeScript config
│   └── vite.config.ts                      # Vite config
├── CODE_OF_CONDUCT.md                      # Community guidelines
├── LICENSE                                 # MIT License
├── README.md                               # Main documentation
├── SECURITY.md                             # Security policy
├── GITHUB_FILES_SUMMARY.md                 # GitHub files overview
└── PROJECT_COMPLETION_CHECKLIST.md         # Completion checklist
```

---

## 🚀 Quick Commands

### Backend Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1              # Windows
source .venv/bin/activate                 # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
# Visit: http://localhost:8000/docs
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Visit: http://localhost:5173
```

### Test Authentication

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","full_name":"Test"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Get current user (replace TOKEN)
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 Documentation Map

| Need         | File                              | Purpose                    |
| ------------ | --------------------------------- | -------------------------- |
| Start here   | `README.md`                       | Overview & features        |
| Quick setup  | `docs/SETUP.md`                   | 5-minute setup             |
| Use template | `docs/TEMPLATE_GUIDE.md`          | Customize for new projects |
| Contribute   | `.github/CONTRIBUTING.md`         | Code style & workflow      |
| Security     | `SECURITY.md`                     | Security guidelines        |
| Community    | `CODE_OF_CONDUCT.md`              | Community standards        |
| History      | `.github/CHANGELOG.md`            | Version history            |
| GitHub files | `GITHUB_FILES_SUMMARY.md`         | All GitHub files overview  |
| Status       | `PROJECT_COMPLETION_CHECKLIST.md` | What's complete            |

---

## 🔑 API Endpoints

```
POST   /auth/register     # Create account
POST   /auth/login        # Login, get tokens
POST   /auth/refresh      # Refresh access token
GET    /auth/me           # Get current user (auth required)
GET    /health            # Health check
```

---

## 🎨 Theme Colors

### Dark Mode (Default)

- Primary Gradient: `#4f8cff` → `#7c4dff` (blue to purple)
- Background: `#0f172a` (dark navy)
- Text: `#f1f5f9` (light gray)

### Light Mode

- Primary Gradient: `#2563eb` → `#6366f1` (darker blue to indigo)
- Background: `#f8fafc` (very light gray)
- Text: `#0f172a` (dark navy)

---

## 🔐 Authentication Flow

```
User Registration
    ↓
Create Account
    ↓
User Login
    ↓
Get Access + Refresh Tokens
    ↓
Store in localStorage
    ↓
AuthContext Stores in Memory
    ↓
Auto-refresh 1 min before expiry
    ↓
Access Expires: 15 min
Refresh Expires: 7 days
```

---

## 📱 Responsive Breakpoints

| Device  | Width     | Behavior                       |
| ------- | --------- | ------------------------------ |
| Mobile  | ≤640px    | Sidebar hidden, hamburger menu |
| Tablet  | 641-768px | Sidebar hidden, hamburger menu |
| Desktop | 769px+    | Sidebar visible, toggle button |

---

## 🛠️ Common Tasks

### Add New Page

1. Create `frontend/src/pages/MyPage.tsx`
2. Add to `App.tsx` inside Layout wrapper
3. Add API calls in `api.ts`

### Add API Endpoint

1. Create schema in `backend/app/schemas.py`
2. Add route in `backend/app/main.py`
3. Create client method in `frontend/src/api.ts`

### Change Colors

- Edit `frontend/src/components/Layout.css`
- Update `--gradient-1` and `--gradient-2` variables
- Modify theme colors as needed

### Deploy to Vercel (Frontend)

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
# Set VITE_API_BASE_URL env var
```

### Deploy to Heroku (Backend)

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
# Set SECRET_KEY and other env vars
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
SECRET_KEY=change-me-in-production
DATABASE_URL=sqlite:///./app.db
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

| Problem          | Solution                                         |
| ---------------- | ------------------------------------------------ |
| Port 8000 in use | `uvicorn app.main:app --reload --port 8001`      |
| Port 5173 in use | `npm run dev -- --port 5174`                     |
| CORS error       | Check `CORS_ORIGINS` in backend `.env`           |
| Token expired    | Refresh token automatically in AuthContext       |
| Database error   | Delete `backend/app.db` and restart              |
| Module not found | Check venv is activated & dependencies installed |

---

## 📊 Tech Stack

**Frontend**

- React 18.3.1
- TypeScript 5.4.5
- React Router 6.30.1
- Vite 5.4.19
- CSS3

**Backend**

- FastAPI 0.116.1
- SQLModel 0.0.24
- Pydantic 2.x
- Bcrypt 4.1.0+
- Python-Jose 3.5.0

**Database**

- SQLite

---

## 🚀 Using as Template

```bash
# Option 1: GitHub Template Button
# Click "Use this template" on GitHub

# Option 2: Clone Method
git clone https://github.com/yourusername/rag.git my-project
cd my-project
# Update package.json, package name
# Customize colors and branding
# Follow docs/TEMPLATE_GUIDE.md
```

---

## ✨ Current Status

✅ **Production-Ready**

- All features implemented
- Full TypeScript coverage
- Comprehensive documentation
- Ready as template
- Security best practices

---

## 📞 Need Help?

1. **Setup Issues** → `docs/SETUP.md`
2. **Using as Template** → `docs/TEMPLATE_GUIDE.md`
3. **Contributing** → `.github/CONTRIBUTING.md`
4. **Security Issues** → `SECURITY.md`
5. **General Info** → `README.md`

---

**Last Updated:** March 24, 2026
**Created for:** RAG Full-Stack Auth Template
