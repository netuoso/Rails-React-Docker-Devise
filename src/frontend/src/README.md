# Frontend Directory Structure

This document explains the organized structure of the React frontend application.

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.js        # Navigation bar component
│   ├── Navbar.css       # Navbar styles
│   └── index.js         # Component exports
├── pages/               # Page-level components
│   ├── Home.js          # Home page component
│   ├── Home.css         # Home page styles
│   ├── Login.js         # Login page component
│   ├── Register.js      # Registration page component
│   └── index.js         # Page exports
├── App.js               # Main application component
├── App.css              # Global application styles
├── index.js             # Application entry point
└── index.css            # Global CSS reset/base styles
```

## Organization Philosophy

### `components/`
Contains **reusable UI components** that can be used across multiple pages:
- Navigation bars
- Buttons
- Form inputs
- Modals
- Cards
- etc.

### `pages/`
Contains **page-level components** that represent entire screens or routes:
- Home page
- Login page
- Registration page
- Profile page
- Settings page
- etc.

## Import Patterns

Thanks to the `index.js` files in each directory, you can use clean import statements:

```javascript
// Import reusable components
import { Navbar } from './components';

// Import page components
import { Home, Login, Register } from './pages';

// Or import individual components
import Navbar from './components/Navbar';
import Home from './pages/Home';
```

## Benefits

1. **Clear Separation of Concerns**: Pages vs reusable components
2. **Easier Navigation**: Developers know where to find specific types of components
3. **Better Maintainability**: Related files are grouped together
4. **Cleaner Imports**: No need for long relative paths
5. **Scalability**: Easy to add new components and pages as the app grows

## Adding New Components

### For Reusable Components:
1. Create `ComponentName.js` and `ComponentName.css` in `src/components/`
2. Add export to `src/components/index.js`

### For Page Components:
1. Create `PageName.js` and `PageName.css` in `src/pages/`
2. Add export to `src/pages/index.js`
