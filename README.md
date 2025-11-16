# FinTrustChain

A decentralized unsecured loan platform based on community trust, featuring a TrustIndex metric and endorsement system that leverages community connections for quick loan access without traditional collateral.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## About

FinTrustChain mimics the credit score system using a TrustIndex metric (0-950) and incorporates an endorsement system that leverages community connections. This platform enables users to quickly access loans without traditional collateral, relying instead on social trust and reputation within the community.

### Key Concepts

- **TrustIndex**: A dynamic metric (0-950) that reflects user creditworthiness based on loan repayment history, endorsements, and community trust
- **Endorsement System**: Bidirectional trust connections where users vouch for each other
- **Guarantor Flow**: Community members can guarantee loans, sharing risk and rewards
- **Dual Roles**: Users can be both lenders and receivers (one active role at a time)

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with email verification
- 📊 **Dynamic TrustIndex**: Real-time trust score calculation based on user behavior
- 🤝 **Endorsement System**: Bidirectional endorsements with monthly limits
- 📝 **Digital Contracts**: PDF-based contracts with e-signatures
- 💰 **Flexible Lending**: Create and browse loan brochures with custom terms
- 📈 **Analytics Dashboard**: Track trust index history and loan performance
- 🔔 **Real-time Notifications**: Stay updated on loan requests, endorsements, and payments
- 💳 **Payment Integration**: Mock payment gateway integration (Phonepe Mock UPI)

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + Nodemailer (email verification)
- **File Storage**: Multer
- **PDF Generation**: pdf-lib
- **Payment**: Razorpay/Stripe (mock)

### Frontend

- **Framework**: React
- **Build Tool**: Vite
- **PDF Viewer**: PDF.js
- **Styling**: CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

Optional:

- **Razorpay/Stripe Account** for payment testing

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Geek-Piyush/FinTrustChain.git
cd FinTrustChain
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## Environment Setup

### Server Configuration

1. Navigate to the `server` directory
2. Create a `.env` file based on the following template:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@fintrustchain.com

# Frontend URL
CLIENT_URL=http://localhost:5173

# Payment Gateway (Optional - for testing)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# File Upload
MAX_FILE_SIZE=5242880
```

### Client Configuration

1. Navigate to the `client` directory
2. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Setting up MongoDB Atlas

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient for testing)
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace `MONGODB_URI` in `.env`

### Email Configuration

For Gmail (recommended for development):

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the app password in `EMAIL_PASSWORD`

## Running the Project

### Development Mode

#### Option 1: Run Both Server and Client Simultaneously

From the root directory:

```bash
# Terminal 1 - Run Server
cd server
npm run dev

# Terminal 2 - Run Client
cd client
npm run dev
```

#### Option 2: Using Concurrently (if configured)

From the root directory:

```bash
npm install
npm run dev
```

### Production Mode

#### Server

```bash
cd server
npm start
```

#### Client

```bash
cd client
npm run build
npm run preview
```

### Using Docker (Optional)

If you prefer Docker:

```bash
cd server
docker-compose up --build
```

## Project Structure

```
FinTrustChain/
├── client/                      # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # API service layer
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── components/          # Reusable components
│   │   ├── context/             # React context (Auth, etc.)
│   │   ├── pages/               # Page components
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js backend
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   ├── middlewares/             # Custom middlewares
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   ├── utils/                   # Utility functions
│   ├── public/                  # Uploaded files (contracts, e-signs)
│   ├── server.js                # Entry point
│   └── package.json
│
└── README.md
```

## API Endpoints Overview

### Authentication

- `POST /api/auth/register` - User registration with e-sign
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification

### User Profile

- `GET /api/users/:id/public` - Public profile
- `GET /api/users/:id/private` - Private dashboard
- `PATCH /api/users/:id` - Update profile
- `POST /api/users/:id/toggle-role` - Switch between Lender/Receiver

### Endorsements

- `POST /api/endorsements` - Create endorsement
- `DELETE /api/endorsements/:id` - Remove endorsement

### Loan Management

- `GET /api/brochures` - Browse loan offers
- `POST /api/brochures` - Create loan brochure (lender)
- `POST /api/loan-requests` - Request loan (receiver)
- `POST /api/contracts/:id/sign` - Sign contract
- `POST /api/payments/:contractId/installment` - Record payment

## Default Access

After successful installation:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Change PORT in server/.env file
PORT=5001
```

**MongoDB connection failed:**

- Verify your MongoDB URI
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

**Email not sending:**

- Verify Gmail app password is correct
- Check if 2FA is enabled on your Google account
- Try using a different SMTP service

**Module not found:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

We welcome contributions! Here are some areas where you can help:

### Future Scope

1. **PAN KYC Integration** - Identity verification system
2. **Smart Contract Port** - Blockchain integration for enhanced security
3. **Advanced Analytics** - ML-based credit risk assessment
4. **Mobile Application** - React Native mobile app
5. **Multi-currency Support** - International lending
6. **Automated Dispute Resolution** - AI-powered conflict management

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Maintainer: [@Geek-Piyush](https://github.com/Geek-Piyush)

---

**Note**: This is a prototype/educational project. For production use, implement additional security measures, comprehensive testing, and compliance with financial regulations.
