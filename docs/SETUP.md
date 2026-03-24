# Setup Instructions for New Projects

This guide helps you quickly set up a new project using RAG as a template.

## Quick Start (5 minutes)

### 1. Create Project from Template

**Option A: GitHub Template Button**

- Go to RAG repository
- Click "Use this template"
- Create new repository
- Clone locally

**Option B: Command Line**

```bash
git clone https://github.com/yourusername/rag.git my-new-project
cd my-new-project
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Start Development

**Terminal 1 - Backend:**

```bash
cd backend
# Activate venv (see step 2)
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` - Done! ✨

## Configuration

### Backend `.env` File

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///./app.db
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### Frontend `.env.local` File

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Project Customization

### Rename Project

Update in `frontend/package.json`:

```json
{
  "name": "my-awesome-app",
  "description": "Description of my app"
}
```

### Update Branding

Edit `frontend/src/components/Layout.tsx`:

- Replace "RAG" text with your app name
- Update styles in `Layout.css`
- Modify gradient colors for your brand

### Add Custom Pages

1. Create file: `frontend/src/pages/MyPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Create component with protected route wrapper

Example page:

```tsx
import { useAuth } from "../auth/AuthContext";

export function MyPage() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1>Welcome, {user?.full_name}!</h1>
      {/* Your content */}
    </div>
  );
}
```

### Add API Endpoints

1. Define schema in `backend/app/schemas.py`
2. Add route in `backend/app/main.py`
3. Add client method in `frontend/src/api.ts`

Example backend route:

```python
@app.get("/api/items")
def get_items(current_user: User = Depends(get_current_user)):
    return {"items": []}
```

Example API client:

```typescript
export const api = {
  getItems: () => request.get("/api/items"),
};
```

Example frontend usage:

```tsx
const { data } = await api.getItems();
```

## Useful Commands

### Backend Commands

```bash
cd backend

# Activate virtual environment
.\.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload

# Access API docs
# Visit http://localhost:8000/docs
```

### Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## Common Issues

### "Port 8000 already in use"

```bash
# Use different port
uvicorn app.main:app --reload --port 8001
```

### "No module named 'app'"

```bash
# Make sure you're in backend directory and venv is activated
cd backend
.\.venv\Scripts\Activate.ps1  # or source .venv/bin/activate
```

### "Cannot find module" in frontend

```bash
# Clear node_modules and reinstall
cd frontend
rm -r node_modules package-lock.json
npm install
```

### "CORS error"

Check that `CORS_ORIGINS` in `backend/.env` includes your frontend URL

## Database Management

### View Database

```bash
# Install sqlite3 tools
# Then browse backend/app.db

# Or use Python
python
>>> import sqlite3
>>> conn = sqlite3.connect('backend/app.db')
>>> cursor = conn.cursor()
>>> cursor.execute("SELECT * FROM user")
```

### Reset Database

```bash
# Delete the database file
rm backend/app.db

# Or on Windows
del backend\app.db

# Restart backend to recreate
```

## Testing

### Test Registration

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","full_name":"Test User"}'
```

### Test Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

### Test Protected Route

```bash
# Replace with token from login response
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Production Checklist

Before deploying:

- [ ] Change `SECRET_KEY` in production `.env`
- [ ] Set `CORS_ORIGINS` to your domain
- [ ] Enable HTTPS
- [ ] Update `DATABASE_URL` for production database
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test in both light and dark mode
- [ ] Test responsive design on mobile
- [ ] Review security configuration
- [ ] Set up error logging
- [ ] Configure backups

## Deployment

### Frontend (Vercel/Netlify)

1. Push to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish dir: `frontend/dist`
5. Add env vars (API URL)

### Backend (Heroku/Railway)

1. Push to GitHub
2. Connect to hosting service
3. Set buildpack: Python
4. Set env vars
5. Deploy

## Next Steps

1. ✅ Follow Quick Start above
2. ✅ Customize branding and colors
3. ✅ Add your features
4. ✅ Test thoroughly
5. ✅ Deploy!

See [TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md) for more detailed customization.

---

**Happy building! 🚀**
