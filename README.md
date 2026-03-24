# RAG - Full-Stack Auth Template

A production-ready full-stack authentication template with React + TypeScript frontend and FastAPI backend. This project serves as a solid foundation for building modern web applications with JWT-based authentication.

## Features

### Frontend (React + TypeScript)

- ✨ Professional layout with topbar, sidebar, and main content area
- 🌙 Dark/Light mode toggle with persistent theme
- 📱 Fully responsive design (desktop, tablet, mobile)
- 🔐 JWT authentication with automatic token refresh
- 🛡️ Protected routes with auth guards
- 📦 TypeScript for type safety
- 🎨 Modern gradient UI with smooth animations
- ⚡ Vite for fast development and build

### Backend (FastAPI)

- 🔑 JWT authentication (access + refresh tokens)
- 🔐 Bcrypt password hashing (12 rounds)
- 👤 User registration and login endpoints
- 🛡️ Protected API routes
- 📊 SQLModel ORM with SQLite database
- 🌐 CORS middleware configuration
- ✅ Input validation with Pydantic
- 🔄 Token refresh mechanism

## Project Structure

```
rag/
├── frontend/                 # React + TypeScript app
│   ├── src/
│   │   ├── components/      # Layout, AuthForm, ProtectedRoute
│   │   ├── pages/           # DashboardPage
│   │   ├── auth/            # AuthContext for state management
│   │   ├── api.ts           # API client with types
│   │   ├── App.tsx          # Routing configuration
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── backend/                  # FastAPI application
    ├── app/
    │   ├── main.py          # FastAPI app and routes
    │   ├── auth.py          # Authentication logic
    │   ├── models.py        # SQLModel database models
    │   ├── schemas.py       # Pydantic request/response models
    │   ├── config.py        # Configuration settings
    │   └── database.py      # Database connection
    ├── requirements.txt     # Python dependencies
    └── app.db              # SQLite database (generated)
```

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv .venv
   
   # Windows
   .\.venv\Scripts\Activate.ps1
   
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run development server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   - API available at: `http://localhost:8000`
   - Interactive docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   - App available at: `http://localhost:5173`

## Environment Configuration

### Backend (`.env`)

```env
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///./app.db
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Frontend (`.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoints

### Authentication

- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate user, receive tokens
- `POST /auth/refresh` - Refresh access token using refresh token
- `GET /auth/me` - Get current user info (requires Bearer token)

### Health Check

- `GET /health` - Server health status

## Usage Guide

### User Registration

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "full_name": "John Doe"
  }'
```

### User Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

Response:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Access Protected Endpoint

```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer {access_token}"
```

## Password Requirements

- **Minimum length:** 8 characters
- **Maximum length:** 72 bytes (UTF-8 encoded) - bcrypt limitation
- **Recommended:** Mix of uppercase, lowercase, numbers, and special characters

## Features Explained

### Dark/Light Mode

- Toggle button in the top-right of the topbar
- Theme preference persists in localStorage
- All components automatically adapt to the selected theme

### Sidebar Toggle

- Click `<<` / `>>` button in the main header bar to show/hide sidebar
- On mobile, sidebar slides in from the left as an overlay
- Button is hidden on mobile, hamburger menu in topbar instead

### Token Refresh

- Access tokens expire after 15 minutes
- Frontend automatically refreshes 1 minute before expiry
- Refresh tokens valid for 7 days
- Seamless user experience with background token refresh

### Protected Routes

- Dashboard and authenticated pages require valid JWT token
- Invalid/expired tokens redirect to login page
- Token stored in localStorage for session persistence

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development

```bash
cd backend
source .venv/bin/activate  # or .\.venv\Scripts\Activate.ps1 on Windows
uvicorn app.main:app --reload  # Hot reload on file changes
```

## Production Deployment

### Frontend

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend

```bash
# Use a production ASGI server like Gunicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Important Security Notes

1. Change `SECRET_KEY` in production
2. Use HTTPS in production
3. Set `CORS_ORIGINS` appropriately for your domain
4. Store sensitive env variables securely (use environment secrets)
5. Set secure cookies for tokens in production
6. Use strong passwords for admin/service accounts

## Technologies Used

### Frontend

- React 18.3.1
- TypeScript 5.4.5
- React Router 6.30.1
- Vite 5.4.19
- CSS3 with CSS Variables

### Backend

- FastAPI 0.116.1
- SQLModel 0.0.24
- Pydantic 2.x
- SQLAlchemy (via SQLModel)
- Bcrypt 4.1.0+
- python-jose 3.5.0
- python-multipart 0.0.6
- email-validator 2.1.0+

## File Organization

### Key Backend Files

- **main.py** - FastAPI application, route definitions
- **auth.py** - Authentication helpers (password hashing, JWT creation)
- **schemas.py** - Request/response Pydantic models
- **models.py** - SQLModel database models
- **config.py** - Configuration and settings
- **database.py** - Database connection and session

### Key Frontend Files

- **Layout.tsx** - Main app layout (topbar, sidebar)
- **AuthContext.tsx** - Authentication state management
- **ProtectedRoute.tsx** - Route guard component
- **api.ts** - Typed HTTP client
- **DashboardPage.tsx** - Dashboard/home page
- **LoginPage.tsx** - User login page
- **RegisterPage.tsx** - User registration page

## Customization

### Add New Pages

1. Create new file in `frontend/src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add menu item in `Layout.tsx` navItems (optional)

### Add New API Endpoints

1. Create new route in `backend/app/main.py`
2. Create request/response models in `schemas.py`
3. Add logic in separate utility files
4. Create client method in `frontend/src/api.ts`

### Modify Styling

- Layout CSS: `frontend/src/components/Layout.css`
- Dashboard CSS: Inline in `frontend/src/pages/DashboardPage.tsx`
- Global styles: `frontend/src/styles.css`
- Theme colors: Update CSS color variables

## Troubleshooting

### CORS Errors

- Ensure backend `CORS_ORIGINS` includes frontend origin
- Check both frontend API URL and backend CORS config

### Token Expiration Issues

- Verify `ACCESS_TOKEN_EXPIRE_MINUTES` setting
- Check token refresh endpoint is working
- Confirm refresh token isn't expired (7 days default)

### Password Validation Errors

- Ensure password is at least 8 characters
- Check password doesn't exceed 72 bytes
- Verify UTF-8 encoding for special characters

### Database Issues

- Delete `app.db` to reset database
- Ensure `app/` directory has write permissions
- Check SQLite is properly installed

## Contributing

When contributing to this template:

1. Maintain TypeScript strict mode
2. Keep code well-documented
3. Test both light and dark modes
4. Test responsive design (mobile, tablet, desktop)
5. Follow existing code style

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

## License

MIT License - feel free to use this template for personal and commercial projects. See [LICENSE](LICENSE) for details.

## Support

For issues, questions, or improvements:

1. Check existing documentation
2. Review inline code comments
3. Test with provided API examples
4. Check browser console for error messages
5. Review [CHANGELOG.md](.github/CHANGELOG.md) for version history

## Changelog

See [CHANGELOG.md](.github/CHANGELOG.md) for complete version history and roadmap.

---

**Happy coding! 🚀**
