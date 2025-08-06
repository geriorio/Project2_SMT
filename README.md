# Samator Truck Management System (SMT)

This project is an Angular-based web application for truck management integrated with Samator Epicor API.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Epicor Credentials
Before running the application, you need to configure your Epicor credentials:

#### Option A: Use Setup Script (Recommended)
```bash
# For Windows (PowerShell)
./setup-credentials.ps1

# For Linux/Mac (Bash)  
./setup-credentials.sh
```

#### Option B: Manual Setup
1. Edit `src/environments/environment.development.ts`
2. Edit `src/environments/environment.ts`
3. Replace placeholders with your actual Epicor credentials:
   ```typescript
   basicAuth: {
     username: 'your_actual_epicor_username',
     password: 'your_actual_epicor_password'
   }
   ```

### 3. Start Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`

## 📋 Features

- **API Integration** with Samator Epicor system
- **Location-based authentication** with GPS
- **Manual location testing** with preset coordinates
- **Employee code validation** 
- **Site management** with flexible input
- **Secure session management**
- **Route protection** with authentication guards
- **Real-time location tracking**

## 🔐 Authentication

The application uses **dual authentication**:
1. **Basic Auth** - Your Epicor credentials
2. **API Key** - Samator API key (pre-configured)

## 📱 Usage

1. **Login**: Enter site code and employee code
2. **Location**: Choose auto GPS or manual coordinates
3. **Dashboard**: Access truck management features
4. **Logout**: Secure session termination

### 🧪 Testing with Manual Location
- Click **"📝 Use Manual Location"** on login form
- Select preset city or enter custom coordinates
- Perfect for testing from different locations without traveling

## 🔧 Development

### Code scaffolding
```bash
ng generate component component-name
ng generate --help  # for more options
```

### Building
```bash
ng build  # Development build
ng build --configuration production  # Production build
```

### Testing
```bash
ng test  # Unit tests
ng e2e   # End-to-end tests
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/     # UI Components
│   ├── services/       # Business Logic
│   ├── guards/         # Route Protection
│   └── ...
├── environments/       # Configuration Files
└── ...
```

## 🔒 Security

- Environment credentials are git-ignored
- Basic Auth over HTTPS
- Session timeout management
- Input validation and sanitization

## 📚 Documentation

- [API Integration Guide](API_LOGIN_INTEGRATION.md)
- [Environment Setup](ENVIRONMENT_SETUP.md) 
- [Changes Summary](CHANGES_SUMMARY.md)
- [Manual Location Testing](MANUAL_LOCATION_GUIDE.md)

## ⚠️ Important Notes

- **Never commit real credentials** to the repository
- Use environment variables for production deployment
- Ensure HTTPS is used in production
- Location services must be enabled in browser

## 🆘 Troubleshooting

### Login Issues
- Verify Epicor credentials are correct
- Check network connectivity
- Ensure location services are enabled

### Build Issues
- Run `npm install` to ensure dependencies
- Check environment file configuration
- Verify Angular CLI version compatibility

## 📞 Support

For technical support or questions, refer to the documentation files or contact the development team.
