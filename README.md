# Resume Builder 📄

A modern, full-stack resume builder application built with Django REST Framework and React. Create, customize, and export professional resumes with ease.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - Secure JWT-based authentication
- **Multiple Resume Management** - Create and manage multiple resumes per user
- **Real-time Editing** - Dynamic form-based resume editing with instant updates
- **PDF Export** - Generate professional PDF resumes using WeasyPrint
- **Responsive Design** - Modern UI built with React and Tailwind CSS

### Resume Sections
- **Personal Information** - Name, title, contact details, and professional links
- **Work Experience** - Company, position, dates, location, and descriptions
- **Education** - School, degree, field of study, GPA, and dates
- **Projects** - Personal/professional projects with technologies and links
- **Skills** - Categorized skills with proficiency levels and years of experience
- **Certifications** - Professional certifications with issuing organizations and dates
- **Achievements** - Awards, recognitions, and notable accomplishments

### Technical Features
- **RESTful API** - Clean, well-documented API endpoints
- **CORS Enabled** - Seamless frontend-backend communication
- **Data Validation** - Comprehensive form validation on both frontend and backend
- **UUID-based Sharing** - Secure resume sharing via unique identifiers
- **SQLite Database** - Lightweight database for development and small deployments

## 🛠️ Tech Stack

### Backend
- **Django 5.2.3** - Python web framework
- **Django REST Framework 3.16.0** - API development
- **Simple JWT 5.5.0** - JWT authentication
- **WeasyPrint 62.3** - PDF generation
- **SQLite** - Database

### Frontend
- **React 19.1.0** - UI library
- **React Router Dom 7.6.2** - Client-side routing
- **React Hook Form 7.58.1** - Form management
- **Axios 1.10.0** - HTTP client
- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **Headless UI 2.2.4** - Accessible UI components
- **Heroicons 2.2.0** - Icon library
- **React Hot Toast 2.5.2** - Toast notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download Git](https://git-scm.com/)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume_builder
   ```

### Backend Setup

1. **Create virtual environment (recommended)**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # source .venv/bin/activate  # On macOS/Linux
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start Django development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm start
   ```

### Access the Application

Once both servers are running:
- **Frontend**: http://localhost:3000 (user interfacer here)
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

## 📚 Usage

### Getting Started

1. **Register/Login**
   - Visit http://localhost:3000
   - Create a new account or login with existing credentials

2. **Create Your First Resume**
   - Click "Create New Resume"
   - Fill in your personal information
   - Add sections (experience, education, skills, etc.)

3. **Export to PDF**
   - Click "Export PDF" to generate a professional resume
   - Download and use for job applications

### API Endpoints

The backend provides RESTful API endpoints:

```
Authentication:
POST /api/auth/register/     - User registration
POST /api/auth/login/        - User login
POST /api/auth/refresh/      - Refresh JWT token

Resumes:
GET    /api/resumes/         - List user's resumes
POST   /api/resumes/         - Create new resume
GET    /api/resumes/{id}/    - Get specific resume
PUT    /api/resumes/{id}/    - Update resume
DELETE /api/resumes/{id}/    - Delete resume

Resume Sections:
GET/POST /api/education/     - Education entries
GET/POST /api/experience/    - Work experience entries
GET/POST /api/projects/      - Project entries
GET/POST /api/skills/        - Skill entries
GET/POST /api/certifications/ - Certification entries
GET/POST /api/achievements/  - Achievement entries

PDF Export:
GET /api/resumes/{uuid}/pdf/ - Generate and download PDF
```

### Frontend Pages

- **Dashboard** - Overview of all resumes
- **Resume Editor** - Create/edit resume sections
- **Preview** - Live preview of resume formatting
- **Settings** - User profile management

## 🏗️ Project Structure

```
resume_builder/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── start-dev.bat            # Automated setup script
├── db.sqlite3               # SQLite database
├── resume_builder/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── user/                    # User management app
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── serializers.py
├── resume/                  # Resume management app
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── serializers.py
├── templates/               # Django templates
│   └── pdf/                # PDF templates
├── static/                  # Static files
├── media/                   # User uploads
└── frontend/               # React application
    ├── package.json
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── context/       # React context
    │   └── utils/         # Utility functions
    └── public/            # Public assets
```
