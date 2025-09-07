# MonkeyMoney - Financial Management Platform

## Overview

MonkeyMoney is a web-based financial management platform that allows users to register accounts, manage balances, deposit funds, withdraw money, and track financial activities. The application features a user dashboard for account management and an admin panel for system administration. The platform is designed with a modern, responsive interface and uses localStorage for data persistence, making it suitable for demonstration and development purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a multi-page architecture with static HTML files:
- **Login System**: Index page with user authentication
- **Registration**: User account creation with validation
- **Dashboard**: User account overview with balance and transaction history
- **Deposit/Withdraw**: Dedicated pages for financial transactions
- **Admin Panel**: Administrative interface for user and transaction management
- **Password Recovery**: Forgot password functionality

### Backend Architecture
- **Flask Web Server**: Simple Python Flask application serving static files
- **Route Structure**: Basic routing for serving HTML pages without complex business logic
- **Session Management**: Uses Flask's session handling with environment-based secret keys
- **Logging**: Configured with Python's logging module for debugging

### Data Storage Strategy
The application uses a localStorage-based approach for data persistence:
- **Client-Side Storage**: All user data, transactions, and admin information stored in browser localStorage
- **Storage Keys**: Organized structure with dedicated keys for users, deposits, withdrawals, and sessions
- **Sample Data**: Pre-populated with demonstration users and transactions
- **No Backend Database**: Eliminates need for server-side database setup

### Authentication System
- **User Authentication**: Username/email and password-based login system
- **Admin Access**: Separate admin credentials with elevated privileges
- **Session Persistence**: localStorage-based session management
- **Firebase Compatibility**: Mock Firebase configuration maintains compatibility while using localStorage

### User Management
- **Registration Flow**: Multi-field registration with validation
- **User Profiles**: Comprehensive user data including balance, membership status, and referral codes
- **Referral System**: Built-in referral code generation and tracking
- **Account Status**: Email verification and account activation states

### Transaction System
- **Deposit Management**: Request-based deposit system with admin approval workflow
- **Withdrawal Processing**: Withdrawal requests with status tracking and admin oversight
- **Balance Management**: Real-time balance updates and transaction history
- **Status Tracking**: Comprehensive transaction status management (pending, approved, rejected)

### Admin Panel Features
- **User Management**: View, edit, and manage user accounts
- **Transaction Oversight**: Approve/reject deposit and withdrawal requests
- **Dashboard Analytics**: System statistics and user activity monitoring
- **Real-time Updates**: Live data refresh and notification system

## External Dependencies

### Frontend Libraries
- **Bootstrap 5.3.0**: UI framework for responsive design and components
- **Font Awesome 6.4.0**: Icon library for user interface elements
- **SweetAlert2**: Enhanced alert and notification system
- **Google Fonts**: Poppins and Segoe UI font families for typography

### Backend Framework
- **Flask**: Python web framework for serving static files and basic routing
- **Python Logging**: Built-in logging module for application monitoring

### Development Tools
- **Environment Variables**: Configuration management for session secrets and API keys
- **Static File Serving**: Direct file serving for HTML, CSS, and JavaScript assets

### Mock Integrations
- **Firebase Configuration**: Compatibility layer for potential future Firebase integration
- **Payment Gateway Simulation**: UI elements for payment processing without actual payment integration

The architecture prioritizes simplicity and demonstration capability while maintaining a structure that could be extended with real backend services and databases in the future.