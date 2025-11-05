# 🚌 Buscor Inspection App

**Professional Bus Safety Inspection Mobile Application**

[![Expo](https://img.shields.io/badge/Built%20with-Expo-blue)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)

## 📱 Overview

The Buscor Inspection App is a comprehensive mobile solution for bus safety inspections, designed specifically for Buscor drivers and mechanics. This app digitizes the traditional paper-based inspection process with modern features including photo documentation, cloud synchronization, and real-time reporting.

## ✨ Features

### 🔍 **Comprehensive Inspection System**
- **31-Point Safety Checklist**: Complete pre-trip inspection covering all critical components
- **Individual Item Notes**: Detailed notes for each inspection point
- **Photo Documentation**: High-quality photo capture for visual evidence
- **GPS Location Tracking**: Automatic location recording for compliance

### 🌟 **Professional Features**
- **Real-time Cloud Sync**: Instant data synchronization with headquarters
- **Role-based Authentication**: Secure access for drivers, mechanics, and admins
- **Multi-depot Support**: Mbombela, Malelane, and Bhoga depot management
- **Offline Capability**: Continue inspections without internet connection

### 📊 **Management Dashboard**
- **Fleet Overview**: Real-time status of all buses
- **Inspection History**: Complete audit trail of all inspections
- **Issue Tracking**: Immediate alerts for safety concerns
- **Compliance Reporting**: Automated safety compliance reports

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Expo CLI
- Android Studio (for Android development)
- Expo Go app (for testing)

### Installation
```bash
# Clone the repository
git clone https://github.com/Babuse111/busco_inspection_app_v2.git

# Navigate to project directory
cd busco_inspection_app_v2

# Install dependencies
npm install

# Start development server
npm start
```

### Development
```bash
# Start with Android emulator
npm run android

# Start with iOS simulator (macOS only)
npm run ios

# Start web version
npm run web
```

## 🏗️ Architecture

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build system
- **React Navigation**: Screen navigation and routing
- **Expo Camera**: Photo capture functionality

### Backend
- **Supabase**: Cloud database and authentication
- **PostgreSQL**: Relational database for data storage
- **Real-time subscriptions**: Live data updates
- **Row Level Security**: Advanced data protection

### Key Components
- **App.js**: Main application component with navigation
- **PhotoCapture.js**: Camera interface for inspection photos
- **supabase.js**: Database service and API integration
- **Authentication**: Secure user login and role management

## 📦 Project Structure

```
busco_inspection_app_v2/
├── components/           # Reusable React components
│   ├── BuscorLogo.js    # Company branding component
│   └── PhotoCapture.js  # Camera interface component
├── services/            # API and database services
│   └── supabase.js      # Supabase integration
├── database/            # Database schemas and setup
│   └── supabase_schema.sql
├── assets/              # Images, icons, and static files
├── App.js               # Main application component
├── app.json            # Expo configuration
├── eas.json            # Build configuration
└── package.json        # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/supabase_schema.sql`
3. Configure Row Level Security policies
4. Set up authentication providers

## 🚀 Deployment

### Play Store Build
```bash
# Build production AAB
npm run build:android

# Build preview APK for testing
npm run build:preview

# Submit to Play Store (after configuration)
npm run submit:android
```

### Build Requirements
- **App signing**: Google Play App Signing configured
- **Permissions**: Camera, location, storage permissions
- **Target SDK**: Android API level 34+
- **Bundle format**: AAB (Android App Bundle)

## 📱 App Store Information

### Package Details
- **Package Name**: `com.buscor.inspection`
- **Version**: 1.0.0
- **Target SDK**: Android 34
- **Minimum SDK**: Android 21

### Permissions
- **Camera**: Capture inspection photos
- **Location**: Record inspection locations
- **Storage**: Save photos locally and to cloud
- **Internet**: Real-time data synchronization

## 🔒 Security & Privacy

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Secure employee ID verification
- **Role-based Access**: Granular permissions by user role
- **Privacy Compliance**: Full GDPR and POPIA compliance

### Cloud Security
- **Supabase Security**: Enterprise-grade cloud infrastructure
- **Backup & Recovery**: Automatic data backup and recovery
- **Monitoring**: Real-time security monitoring and alerts

## 📋 Testing

### Manual Testing
1. **Authentication Flow**: Login with employee credentials
2. **Inspection Process**: Complete full 31-point checklist
3. **Photo Capture**: Take and upload inspection photos
4. **Data Sync**: Verify real-time cloud synchronization
5. **Offline Mode**: Test functionality without internet

### Automated Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **React Native Best Practices**: Follow community standards

## 📞 Support

### Technical Support
- **Email**: support@buscor.co.za
- **Phone**: +27 (0)13 xxx-xxxx
- **Documentation**: See `/docs` folder

### Bug Reports
- Create an issue on GitHub
- Include device information and steps to reproduce
- Attach screenshots or videos if helpful

## 📄 License

This project is proprietary software owned by Buscor Transportation Services.

## 🙏 Acknowledgments

- **Expo Team**: For the excellent development platform
- **Supabase**: For the robust backend infrastructure
- **React Native Community**: For the amazing ecosystem
- **Buscor Team**: For their requirements and feedback

---

## 📱 Download

The app will be available on Google Play Store once approved.

**For Buscor employees**: Contact your supervisor for access credentials and installation instructions.

---

**Built with ❤️ for safer public transportation**
