# Resume Builder Frontend

A modern React application for the Resume Builder project, completely rewritten from Django templates and jQuery to a full-featured SPA.

## Features

- **Modern React Architecture**: Built with React 19, React Router, and Context API
- **Beautiful UI**: Styled with Tailwind CSS and Headless UI components
- **Authentication**: JWT-based authentication with protected routes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **State Management**: Context API for global state management
- **Form Handling**: React Hook Form with validation
- **Notifications**: Toast notifications for user feedback
- **API Integration**: Axios-based API client with interceptors

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components (Navbar, etc.)
│   ├── resume/          # Resume editor components
│   └── ui/              # Basic UI components (Button, Input, etc.)
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
└── utils/               # Utility functions
```

## Key Components

### Authentication
- `LoginForm` - User login with validation
- `SignupForm` - User registration with validation
- `ProtectedRoute` - Route protection component
- `AuthContext` - Global authentication state

### Dashboard
- `Dashboard` - Main dashboard page
- `ResumeCard` - Individual resume card component
- `CreateResumeModal` - Modal for creating new resumes

### UI Components
- `Button` - Customizable button component
- `Input` - Form input with validation support
- `Modal` - Reusable modal component
- `Dropdown` - Dropdown menu component
- `LoadingSpinner` - Loading indicator

### API Integration
- Centralized API client with Axios
- Request/response interceptors for auth and error handling
- Typed API methods for all endpoints
- Automatic token refresh handling

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:8000/api
GENERATE_SOURCEMAP=false
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Make sure your Django backend is running on `http://localhost:8000`

## API Integration

The frontend communicates with the Django backend through REST APIs:

- **Authentication**: `/api/auth/token/`, `/api/auth/user/`
- **Resumes**: `/api/resumes/`
- **Resume Sections**: `/api/education/`, `/api/experience/`, etc.

## State Management

The app uses React Context for state management:

- `AuthContext` - User authentication state
- Component-level state for UI interactions
- Custom hooks for data fetching and state logic

## Styling

- **Tailwind CSS** for utility-first styling
- **Headless UI** for accessible component primitives
- **Heroicons** for consistent iconography
- Custom color palette matching the original design

## Future Enhancements

- Resume editor with drag-and-drop sections
- Real-time preview
- PDF export functionality
- Multiple resume templates
- Advanced form validation
- Dark mode support
- Internationalization (i18n)

## Migration from Django Templates

This React app replaces the following Django templates and JavaScript:

- `templates/base.html` → React Layout components
- `templates/dashboard.html` → Dashboard page and components
- `templates/resume_editor.html` → Resume editor page (to be implemented)
- `static/js/auth.js` → AuthContext and auth components
- `static/js/dashboard.js` → Dashboard components and hooks
- `static/js/utils.js` → API services and utility functions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
