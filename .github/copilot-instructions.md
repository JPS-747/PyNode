# RAG - Full-Stack Auth Template

## Project Overview

RAG is a production-ready full-stack authentication template with:

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** FastAPI + SQLModel + JWT Auth
- **Database:** SQLite
- **Features:** User auth, dark/light mode, responsive layout

## Architecture

### Frontend (`frontend/`)

- React Router for client-side routing
- AuthContext for state management
- Protected routes with auth guards
- Dark/light mode toggle
- Responsive CSS Grid/Flexbox layout
- Typed API client

### Backend (`backend/`)

- FastAPI async endpoints
- SQLModel ORM with SQLite
- JWT tokens (access + refresh)
- Bcrypt password hashing
- Pydantic validation
- CORS middleware

## Key Files

**Frontend:**

- `src/App.tsx` - Main routing
- `src/components/Layout.tsx` - Topbar, sidebar, theme controls
- `src/auth/AuthContext.tsx` - Auth state management
- `src/api.ts` - Typed HTTP client

**Backend:**

- `app/main.py` - FastAPI routes
- `app/auth.py` - Password hashing, JWT tokens
- `app/models.py` - SQLModel database models
- `app/schemas.py` - Pydantic request/response models

## Important Implementation Details

### Authentication

- Access tokens: 15 minutes
- Refresh tokens: 7 days
- Password limit: 72 bytes (bcrypt constraint)
- Automatic refresh: 1 minute before expiry

### Theme System

- Dark/Light mode via CSS variables
- Stored in localStorage
- Applied via `data-theme` attribute
- Smooth transitions (0.3s ease)

### Responsive Design

- Mobile: ≤640px
- Tablet: 641-768px
- Desktop: 769px+
- Sidebar collapsible on mobile

## Development Workflow

1. **Setup backend:**

   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1  # Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Setup frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - API docs: http://localhost:8000/docs

## Documentation Files

- `README.md` - Main project documentation
- `docs/SETUP.md` - Quick setup guide
- `docs/TEMPLATE_GUIDE.md` - Using as template
- `SECURITY.md` - Security policies
- `CODE_OF_CONDUCT.md` - Community guidelines
- `.github/CONTRIBUTING.md` - Contributing guidelines
- `.github/CHANGELOG.md` - Version history

## GitHub Resources

- `.github/workflows/deploy.yml` - CI/CD pipeline
- `.github/ISSUE_TEMPLATE/` - Issue templates
- `.github/pull_request_template.md` - PR template
- `.gitignore` - Git ignore rules
- `LICENSE` - MIT License

## Common Tasks

### Adding a New Page

1. Create `frontend/src/pages/NewPage.tsx`
2. Add route in `App.tsx` wrapped in Layout
3. Add navigation link in `Layout.tsx` (optional)

### Adding an API Endpoint

1. Create schema in `backend/app/schemas.py`
2. Add route to `backend/app/main.py`
3. Add client method in `frontend/src/api.ts`

### Customizing Colors

Edit `frontend/src/components/Layout.css`:

- Update CSS variables for theme colors
- Gradients are controlled via `--gradient-1` and `--gradient-2`

### Modifying Authentication

- Token expiry: `backend/app/config.py`
- Password validation: `backend/app/auth.py`
- Auth flow: `frontend/src/auth/AuthContext.tsx`

## Code Standards

**TypeScript:**

- Strict mode enabled
- No `any` types without justification
- Export types and interfaces explicitly

**Python:**

- Type hints for all functions
- PEP 8 compliance
- Meaningful variable names

**CSS:**

- BEM naming convention
- Mobile-first responsive design
- Use CSS variables for colors

## Testing

Frontend API calls can be tested at http://localhost:8000/docs
Use curl for backend testing (see SETUP.md for examples)

## Deployment

**Frontend:**

- Build: `npm run build`
- Deploy `dist/` to Vercel, Netlify, or static host
- Set `VITE_API_BASE_URL` env var

**Backend:**

- Use Gunicorn: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
- Deploy to Heroku, Railway, AWS, or similar
- Set all env vars from `.env.example`

## Project Status

✅ **Complete & Production-Ready**

- All features implemented
- Full TypeScript coverage
- Comprehensive documentation
- Ready to use as template
- Security best practices applied

## Using as Template

See `docs/TEMPLATE_GUIDE.md` for detailed instructions on:

- Using GitHub template feature
- Customizing for new projects
- Adding custom features
- Deployment configuration

## Future Enhancements

Potential additions (see CHANGELOG.md):

- Email verification
- Password reset
- OAuth2 integration
- Role-based access control
- Two-factor authentication
- Docker containers
- Database migrations

## Contact & Support

- Review inline code comments
- Check documentation files
- Open issues on GitHub
- Follow Code of Conduct
