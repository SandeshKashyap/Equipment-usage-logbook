# Equipment Management System

A full-stack web application for managing equipment and their maintenance lifecycle, built with React, Spring Boot, and PostgreSQL.

## 📋 Features

### Core Features
- **Equipment Management**: Create, read, update, and delete equipment records
- **Equipment Types**: Dynamic equipment types loaded from database
- **Status Tracking**: Track equipment status (Active, Inactive, Under Maintenance)
- **Maintenance Logging**: Log maintenance events with automatic status updates

### Business Rules
1. **Maintenance Auto-Update (Workflow 1)**:
   - When a maintenance log is created, the equipment status automatically changes to "Active"
   - The Last Cleaned Date automatically updates to the Maintenance Date

2. **30-Day Status Constraint (Workflow 2)**:
   - Equipment cannot be marked as "Active" if the Last Cleaned Date is older than 30 days
   - Backend enforces this rule and returns a meaningful error message

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling (compliant with assignment requirements)
- **shadcn/ui-inspired components** - UI components (no raw HTML form elements)
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **date-fns** - Date formatting

### Backend
- **Spring Boot 3.2.2** with Java 17
- **Spring Data JPA** with Hibernate
- **PostgreSQL 15** - Database
- **Maven** - Build tool
- **Jakarta Bean Validation** - Input validation
- **Lombok** - Boilerplate reduction

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

- **Java 17 or higher**
  ```bash
  java -version
  ```

- **Maven 3.9+**
  ```bash
  mvn -version
  ```

- **Node.js 18+** and **npm**
  ```bash
  node -v
  npm -v
  ```

- **PostgreSQL 15+**
  - Installation instructions below

## 🚀 Installation & Setup

### 1. PostgreSQL Setup

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15

# Create database
/opt/homebrew/opt/postgresql@15/bin/createdb equipment_management

# Verify installation
/opt/homebrew/opt/postgresql@15/bin/psql equipment_management
```

#### Windows
1. Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Follow installation wizard (use default port 5432)
3. Use pgAdmin or command line to create database:
   ```sql
   CREATE DATABASE equipment_management;
   ```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb equipment_management
```

### 2. Database Schema Setup

The schema is already set up! The database tables have been created with the following structure:

```sql
-- Tables: equipment_types, equipment, maintenance_logs
-- With proper foreign key relationships and indexes
```

To view the schema, check `backend/src/main/resources/schema.sql`

### 3. Backend Setup

**Quick Start (Recommended)**:
```bash
# From project root directory
./start-backend.sh
```

**Manual Setup**:
```bash
# Navigate to backend directory
cd backend

# Set Java 17 (required for Lombok compatibility)
export JAVA_HOME=/opt/homebrew/opt/openjdk@17

# Install dependencies and compile
mvn clean install

# Run the application
mvn spring-boot:run
```

**Note**: Java 17 is required. If you have Java 21+ installed by Homebrew, Maven will use it by default but Lombok may have compatibility issues. The startup script automatically uses Java 17.

The backend will start on **http://localhost:8080**

#### Verify Backend is Running
```bash
# Test equipment types endpoint
curl http://localhost:8080/api/equipment-types

# Test equipment endpoint
curl http://localhost:8080/api/equipment
```

### 4. Frontend Setup

**Quick Start (Recommended)**:
```bash
# From project root directory (in a new terminal)
./start-frontend.sh
```

**Manual Setup**:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on **http://localhost:5173**

Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

---

## ⚡ Quick Start (All in One)

For the fastest setup experience:

```bash
# Terminal 1: Start Backend
./start-backend.sh

# Terminal 2: Start Frontend
./start-frontend.sh
```

Then open [http://localhost:5173](http://localhost:5173) in your browser

## 📖 API Documentation

### Equipment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get all equipment |
| GET | `/api/equipment/{id}` | Get equipment by ID |
| POST | `/api/equipment` | Create new equipment |
| PUT | `/api/equipment/{id}` | Update equipment |
| DELETE | `/api/equipment/{id}` | Delete equipment |

### Maintenance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/maintenance` | Create maintenance log |
| GET | `/api/equipment/{id}/maintenance` | Get maintenance history |

### Equipment Types Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment-types` | Get all equipment types |

### Example Request Bodies

**Create Equipment:**
```json
{
  "name": "Industrial Vacuum Cleaner",
  "typeId": 1,
  "status": "Active",
  "lastCleanedDate": "2024-02-20"
}
```

**Create Maintenance Log:**
```json
{
  "equipmentId": 1,
  "maintenanceDate": "2024-02-27",
  "notes": "Routine maintenance completed",
  "performedBy": "John Doe"
}
```

## 🧪 Testing the Application

### 1. Test Equipment CRUD
- Click "Add Equipment" to create new equipment
- Edit existing equipment
- Delete equipment
- Verify all operations work correctly

### 2. Test Workflow 1 (Maintenance Auto-Update)
1. Create equipment with status "Inactive" or "Under Maintenance"
2. Click "Maintenance" button on the equipment
3. Log a maintenance event
4. Verify equipment status changes to "Active"
5. Verify Last Cleaned Date updates to the maintenance date

### 3. Test Workflow 2 (30-Day Constraint)
1. Try to set equipment to "Active" with no Last Cleaned Date
   - Should fail with error message
2. Try to set equipment to "Active" with Last Cleaned Date > 30 days ago
   - Should fail with error: "Cannot set status to Active: Last Cleaned Date is older than 30 days"
3. Set equipment to "Active" with Last Cleaned Date < 30 days ago
   - Should succeed

### 4. Test Maintenance History
1. Click "History" button on any equipment
2. View all maintenance logs for that equipment
3. Verify logs are sorted by date (newest first)

## 📚 Additional Libraries Used

### Frontend
- **class-variance-authority** - Utility for constructing className strings
- **clsx** - Conditional className utility
- **tailwind-merge** - Merge Tailwind classes without conflicts
- **lucide-react** - Icon library (if needed for future enhancements)

All libraries are installed via npm and are listed in `frontend/package.json`

### Backend
All dependencies are managed via Maven in `backend/pom.xml`:
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Validation
- PostgreSQL Driver
- Lombok

## 🔧 Configuration

### Backend Configuration
Located at `backend/src/main/resources/application.properties`:

```properties
# Server runs on port 8080
server.port=8080

# Database connection
spring.datasource.url=jdbc:postgresql://localhost:5432/equipment_management
spring.datasource.username=sandesh  # Use your macOS username (for Homebrew PostgreSQL)
spring.datasource.password=          # Empty for local development

# JPA Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

**Important**: For macOS with Homebrew PostgreSQL, the default user is your system username (not `postgres`). The password is typically empty for local development. If you're on a different system or have set up PostgreSQL differently, update the username and password accordingly.

### Frontend Configuration
API base URL is configured in each API service file:
- `frontend/src/api/equipment.ts`
- `frontend/src/api/equipmentTypes.ts`
- `frontend/src/api/maintenance.ts`

Default: `http://localhost:8080/api`

## 🏗 Project Structure

```
Equipment usage logbook/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/equipment/
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access
│   │   ├── model/             # Entity classes
│   │   ├── dto/               # Data transfer objects
│   │   └── exception/         # Exception handling
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── schema.sql
│   │   └── data.sql
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── equipment/     # Equipment components
│   │   │   └── maintenance/   # Maintenance components
│   │   ├── api/               # API service layer
│   │   ├── types/             # TypeScript types
│   │   └── lib/               # Utilities
│   └── package.json
├── README.md
├── COMPLIANCE.md
└── .gitignore
```

## 🤔 Assumptions

1. **Equipment Types**: Pre-seeded in database; no UI to add new types (can be added via SQL)
2. **Maintenance Logs**: Append-only; cannot be edited or deleted
3. **Last Cleaned Date**: Optional for new equipment (can be null)
4. **Equipment Deletion**: CASCADE deletes maintenance history
5. **Timestamps**: Stored in server timezone
6. **Authentication**: Not required for this assignment
7. **Single User**: No concurrent editing concerns
8. **PostgreSQL**: Running locally on default port 5432
9. **Database User**: Using default `postgres` user (update credentials in `application.properties` if different)

## 🐛 Troubleshooting

### Backend Issues

**Port 8080 already in use**
```bash
# Find and kill process using port 8080
lsof -ti:8080 | xargs kill -9
```

**Database connection failed**
- Ensure PostgreSQL is running: `brew services list` (macOS)
- Verify database exists: `psql -l`
- Check credentials in `application.properties`

**Maven build fails**
```bash
# Clean and rebuild
mvn clean install -U
```

### Frontend Issues

**Module not found errors**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**CORS errors**
- Ensure backend is running
- Check API base URL in API service files
- Backend has `@CrossOrigin(origins = "*")` on controllers

**Port 5173 already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## 📄 License

This project was created as a technical assignment for a software development internship interview.

## 👤 Author

Sandesh

---

**Note**: This application was built following strict compliance requirements including:
- No inline styles
- No raw HTML form elements
- Single reusable form component for Add/Edit operations
- Dynamic equipment types (not hardcoded)
- Backend business rule enforcement

For compliance verification, see [COMPLIANCE.md](COMPLIANCE.md)
