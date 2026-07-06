# Contributing to SynapseIQ

Thank you for your interest in contributing to SynapseIQ! This document outlines the guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
1. Check the [existing issues](https://github.com/pravalika2307/SynapseIQ/issues) to avoid duplicates
2. Collect relevant information: browser version, OS, steps to reproduce, expected vs actual behavior

When filing a bug report, please include:
- A clear, descriptive title
- Steps to reproduce the behavior
- Expected vs actual behavior
- Screenshots or screen recordings if applicable
- Your environment details (OS, browser, Node.js version)

### Suggesting Features

Feature suggestions are welcome! Please:
1. Check if the feature has already been requested
2. Describe the use case and business value clearly
3. Label your issue with `enhancement`

### Pull Requests

1. **Fork** the repository and create a new branch from `main`
2. **Branch naming conventions:**
   - Features: `feat/short-description`
   - Bug fixes: `fix/short-description`
   - Documentation: `docs/short-description`
   - Refactoring: `refactor/short-description`
3. **Make your changes** following the code style guidelines below
4. **Write or update tests** if applicable
5. **Update documentation** (README, comments) as needed
6. **Commit** using [Conventional Commits](https://www.conventionalcommits.org):
   ```
   feat: add scenario export to PDF
   fix: resolve tooltip z-index on mobile
   docs: update installation instructions
   refactor: extract correlation logic to utility
   ```
7. **Open a Pull Request** with a clear description of changes

## Code Style

### TypeScript
- Strict mode enabled — all variables must be typed
- Use `interface` for object shapes, `type` for unions/intersections
- Avoid `any` — use `unknown` and type guards instead
- Prefer `const` over `let`; avoid `var`

### React
- Functional components only — no class components
- Custom hooks for shared stateful logic (prefix with `use`)
- Keep components focused and under ~300 lines
- Props should be typed with explicit interfaces

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design token conventions in `index.css`
- Dark mode only — maintain the `#0D1117` / `#151B23` color palette
- Accent color: `#83D18B` (sage green)

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org):
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SynapseIQ.git
cd SynapseIQ

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## Project Structure

See [README.md](./README.md#-project-structure) for a detailed breakdown of the project structure.

## Questions?

Open a [GitHub Discussion](https://github.com/pravalika2307/SynapseIQ/discussions) for general questions.

---

*Thank you for helping make SynapseIQ better!*
