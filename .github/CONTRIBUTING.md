# Contributing Guidelines

Thank you for your interest in contributing to this project! Here are guidelines to help you get started.

## Code Style

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for all functions
- Maximum line length: 88 characters (Black formatter)
- Use meaningful variable and function names

### TypeScript (Frontend)

- Use strict TypeScript mode
- Export types and interfaces clearly
- Use descriptive variable names
- Follow React hooks best practices

### CSS

- Use meaningful class names
- Group related styles together
- Use CSS variables for colors
- Mobile-first responsive design

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly in both light and dark modes
4. Test responsive design (mobile, tablet, desktop)
5. Commit with clear messages: `git commit -m "Add feature: description"`
6. Push to branch: `git push origin feature/your-feature`
7. Open a Pull Request

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] Changes work in dark and light modes
- [ ] Responsive design tested on multiple screen sizes
- [ ] No console errors or warnings
- [ ] TypeScript compilation succeeds
- [ ] Backend tests pass (if applicable)

## Commit Messages

Use clear, descriptive commit messages:

```
Add feature: Brief description

Longer explanation if needed. Explain what was changed and why.
```

Good examples:

- `Add dark mode toggle to topbar`
- `Fix sidebar positioning on mobile`
- `Improve password validation error messages`
- `Refactor auth context for better performance`

## Pull Request Guidelines

1. Provide a clear title and description
2. Reference any related issues
3. Explain the changes and motivation
4. Include screenshots for UI changes
5. Ensure all tests pass

## Reporting Issues

When reporting bugs, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/system information
- Screenshots if applicable

## Feature Requests

Share your feature ideas:

1. Check if similar feature exists
2. Describe the use case
3. Explain expected behavior
4. Consider edge cases

## Code Review

Be respectful in code reviews. We're all learning!

- Ask questions for clarity
- Suggest improvements constructively
- Praise good solutions

---

Thank you for contributing! 🙏
