# Modern Booking App Documentation

## Overview
A Vue.js-based booking application with Supabase backend, designed for service providers (like hairdressers, stylists, etc.) to manage their appointments and for clients to book services.

## Tech Stack
- **Frontend**: Vue 3 + TypeScript
- **Backend**: Supabase
- **Styling**: Tailwind CSS with custom components
- **State Management**: Pinia
- **Authentication**: Supabase Auth (Phone-based)
- **UI Components**: Custom components with modern glass-effect design
- **Localization**: Ukrainian language

## Core Features

### Authentication
- Phone-based authentication with OTP verification
- Separate flows for clients and providers
- Session persistence
- Role-based access (client/provider)

### Database Schema
1. **Users Table**
   - Basic fields: `id`, `phone`, `name`, `role` (client/provider)
   - Provider fields: `gender`, `photo_url`, `specializations[]`, `auto_confirm`

2. **Specializations Table**
   - Fields: `id`, `name_male`, `name_female`
   - Predefined specializations in Ukrainian
   - Gender-specific naming

3. **Working Hours Table**
   - Fields: `id`, `provider_id`, `day_of_week`, `slots` (JSONB), `is_working`
   - Flexible time slots support

4. **Services Table**
   - Fields: `id`, `name`, `duration`, `price`, `description`, `provider_id`

5. **Appointments Table**
   - Fields: `id`, `service_id`, `client_id`, `provider_id`, `start_time`, `end_time`
   - Status tracking: `status` (pending/confirmed/cancelled/completed)
   - Payment tracking: `payment_status` (pending/authorized/captured/refunded)

### UI/UX Features
- Dark/Light theme support
- Glass-effect card design
- Noise texture overlay
- Responsive layout
- Loading states and error handling
- Modern typography with IBM Plex Sans/Serif

### Demo Provider
- Default provider account for testing
- ID: '00000000-0000-0000-0000-000000000001'
- Predefined working hours and services

## Key Components

### Layouts
- `BaseLayout.vue`: Main layout with glass-effect card
- Provider-specific layouts for dashboard

### Views
1. **Client Flow**
   - WelcomeView: Landing page with provider info
   - PhoneView: Phone number input
   - VerifyView: OTP verification
   - RegisterView: New user registration
   - ServicesView: Service selection
   - CalendarView: Appointment scheduling
   - AppointmentsView: Appointment management

2. **Provider Flow**
   - LoginView: Provider authentication
   - VerifyView: Provider OTP verification
   - SettingsView: Profile management
   - ServicesView: Service management

## Styling Guidelines

### Colors
- Light theme:
  - Background: #F8FAFC
  - Foreground: #0F172A
  - Primary: #3730A3
  - Muted: #E2E8F0
  - Muted Foreground: #64748B
  - Card: rgba(255, 255, 255, 0.8)
  - Border: rgba(226, 232, 240, 0.8)

- Dark theme:
  - Background: #0A0A0A
  - Foreground: #F8FAFC
  - Primary: #6366F1
  - Muted: #1E293B
  - Muted Foreground: #94A3B8
  - Card: rgba(30, 41, 59, 0.8)
  - Border: rgba(51, 65, 85, 0.8)

### Components
- Card background: Glass effect with backdrop-blur-2xl
- Border radius: 12px (rounded-xl)
- Button height: 40px
- Font sizes: Base 16px (1rem)

### Special Effects
- Noise texture overlay (75px repeat pattern)
- Glass effect with backdrop-filter: blur(24px)
- Smooth transitions on hover/focus states
- Haptic feedback on valid inputs (iOS)

### Design Principles
- Clean, minimal interface
- High contrast for accessibility
- Consistent spacing and alignment
- Responsive design for all screen sizes
- Interactive feedback on all actions

## Current State
- Basic authentication flows implemented
- Database schema established
- Core UI components created
- Theme switching functionality working
- Glass-effect design implemented

## TODO/In Progress
- [ ] Complete appointment booking flow
- [ ] Provider dashboard implementation
- [ ] Payment integration
- [ ] Push notifications
- [ ] Service management for providers
- [ ] Working hours management
- [ ] Client appointment history

## Notes
- The app uses a demo provider account for development
- All text content is in Ukrainian
- Design focuses on modern, clean aesthetics with glass-effect cards
- Phone number formatting follows Ukrainian standards (+380)