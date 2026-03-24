# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please email security@example.com instead of using the issue tracker. Please include:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## Security Best Practices

### For Users

1. Change `SECRET_KEY` in production
2. Use HTTPS for all connections
3. Keep dependencies updated
4. Store tokens securely (use httpOnly cookies in production)
5. Use strong, unique passwords
6. Enable CORS only for trusted origins

### For Developers

1. Never commit `.env` files or secrets
2. Use environment variables for sensitive data
3. Validate and sanitize all inputs
4. Use prepared statements (SQLModel handles this)
5. Keep dependencies up to date
6. Review code for XSS and CSRF vulnerabilities
7. Use HTTPS in production
8. Enable CORS headers carefully

### Password Security

- Bcrypt with 12 rounds is used for password hashing
- Passwords are limited to 72 bytes (bcrypt constraint)
- Always validate password strength
- Never log passwords
- Use secure password reset mechanisms

### Token Security

- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Tokens are signed with `SECRET_KEY`
- In production, use httpOnly cookies
- Implement token blacklist for logout

## Known Vulnerabilities

None currently known. Please report any discovered vulnerabilities responsibly.

## Updates and Patches

Security patches will be released as needed. Users should:

1. Monitor this repository for updates
2. Update dependencies regularly
3. Test thoroughly before deploying updates
4. Follow semantic versioning for updates
