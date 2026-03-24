# Using RAG as a Template

RAG is designed to serve as a solid foundation for new projects. Here's how to use it effectively.

## Method 1: GitHub Template (Recommended)

1. Click **"Use this template"** on the GitHub repository page
2. Enter your new repository name
3. Choose public or private
4. Click **"Create repository from template"**
5. Clone your new repository locally

## Method 2: Manual Clone

```bash
git clone https://github.com/yourusername/rag.git my-project
cd my-project
git remote set-url origin https://github.com/yourusername/my-project.git
```

## Customization Steps

### 1. Update Project Metadata

**`frontend/package.json`:**

```json
{
  "name": "my-project",
  "description": "My awesome project"
}
```

**`backend/requirements.txt`** - Already generic, no changes needed

### 2. Rename Components

Replace "RAG" with your project name:

**`frontend/src/components/Layout.tsx`:**

- Search and replace "RAG" logo text
- Update app title class name if desired

**CSS Variables:**

- Update color schemes in `Layout.css`
- Modify gradient colors for branding

### 3. Update Environment Variables

**`backend/.env`:**

```env
SECRET_KEY=your-new-unique-secret-key-here
DATABASE_URL=sqlite:///./app.db
```

**`frontend/.env.local`:**

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Add Your Features

#### Frontend

1. Create new pages in `src/pages/`
2. Add routes to `src/App.tsx`
3. Create components in `src/components/`
4. Update API client in `src/api.ts`

#### Backend

1. Add routes to `app/main.py`
2. Create models in `app/models.py`
3. Create schemas in `app/schemas.py`
4. Add business logic in separate files

### 5. Update Documentation

1. Replace this section in `README.md` with your project description
2. Update project structure diagram
3. Add API endpoints specific to your project
4. Document any custom configuration

### 6. Clean Up

1. Delete or update `.github/copilot-instructions.md`
2. Update `CHANGELOG.md` with your changes
3. Delete example content from Dashboard page
4. Update `LICENSE` if using different license

## Project Structure Recommendations

```
my-project/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── auth/          # Auth-related (already complete)
│   │   ├── api.ts         # API client
│   │   └── types/         # TypeScript types (optional)
│   └── ...
├── backend/
│   ├── app/
│   │   ├── api/           # API route modules
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Request/response schemas
│   │   ├── services/      # Business logic
│   │   └── ...
│   └── ...
└── docs/                  # Additional documentation
```

## Adding Features

### Database Models

Add to `backend/app/models.py`:

```python
from sqlmodel import SQLModel, Field
from typing import Optional

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    user_id: int = Field(foreign_key="user.id")
```

### API Routes

Add to `backend/app/main.py`:

```python
@app.post("/posts", response_model=Post)
def create_post(post: PostCreate, current_user: User = Depends(get_current_user)):
    # Create post logic
    return post
```

### Frontend Pages

Create `frontend/src/pages/PostsPage.tsx`:

```tsx
import { useState, useEffect } from "react";
import { api } from "../api";

export function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts").then((data) => setPosts(data));
  }, []);

  return <div>{/* Your content */}</div>;
}
```

## Deployment Configuration

### Frontend Deployment (Vercel, Netlify)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variable: `VITE_API_BASE_URL`

### Backend Deployment (Heroku, Railway, AWS)

1. Set up Python environment
2. Install dependencies: `pip install -r requirements.txt`
3. Set environment variables
4. Run command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`

## Common Customizations

### Change Primary Color

Edit `frontend/src/components/Layout.css`:

```css
--color-primary: #your-color;
--gradient-1: #color1;
--gradient-2: #color2;
```

### Add API Endpoints

1. Update `backend/app/schemas.py` with new models
2. Add routes to `backend/app/main.py`
3. Update `frontend/src/api.ts` with new methods
4. Create components to consume the API

### Modify Authentication

The auth system is production-ready but can be extended:

- Add roles/permissions
- Implement email verification
- Add OAuth providers
- Enable two-factor authentication

## Testing Your Template

Before deploying:

1. **Backend**

   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn app.main:app --reload
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test auth flow**

   - Register new user
   - Login
   - Logout
   - Token refresh

4. **Test theme**
   - Toggle dark/light mode
   - Verify colors apply correctly
   - Check responsive design

## Troubleshooting

### Port Already in Use

```bash
# Change backend port
uvicorn app.main:app --reload --port 8001

# Change frontend port
npm run dev -- --port 5174
```

### Database Issues

```bash
# Reset database
rm backend/app.db
```

### CORS Errors

Check `CORS_ORIGINS` in `backend/.env`

### TypeScript Errors

```bash
cd frontend
npm run lint
```

## Next Steps

1. ✅ Clone or create from template
2. ✅ Customize metadata and branding
3. ✅ Set up environment variables
4. ✅ Test the default setup
5. ✅ Add your custom features
6. ✅ Update documentation
7. ✅ Deploy!

---

**Need help?** Check the main [README.md](README.md) or review the codebase - it's well-documented!
