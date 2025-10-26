<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Bus Inspection App - Copilot Instructions

This is a React Native Expo mobile application for bus inspection management system.

## Project Overview
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack and Tab navigators)
- **Target Platform**: Mobile (iOS/Android)
- **Purpose**: Digital bus inspection app replacing manual paper-based inspections

## Key Features
1. **Authentication System**: Admin login, Driver/Mechanic login
2. **Bus Selection**: Choose from available buses with details
3. **Inspection Process**: Step-by-step inspection forms with checklists
4. **GPS Location**: Capture location data during inspections
5. **Real-time Data**: Store inspection data for admin review

## Code Style Guidelines
- Use functional components with React Hooks
- Follow React Native best practices
- Use meaningful component names
- Implement proper error handling
- Include loading states for async operations
- Use consistent styling with StyleSheet

## Component Structure
- Keep components small and focused
- Use custom hooks for business logic
- Implement proper prop validation
- Follow atomic design principles

## Navigation Pattern
- Stack navigation for authentication flow
- Tab navigation for main app sections
- Modal presentations for forms and selections

## State Management
- Use React hooks (useState, useEffect, useContext)
- Implement local storage with AsyncStorage
- Handle form state management properly

## Styling Guidelines
- Use StyleSheet.create() for styles
- Implement responsive design
- Follow the orange/teal color scheme from the designs
- Use consistent spacing and typography
- Implement proper accessibility features
