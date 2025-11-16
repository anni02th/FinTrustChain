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

- 🔐 **Secure Authentication**: JWT-backed sessions with SendGrid-powered email verification
- 📊 **Dynamic TrustIndex**: Real-time trust score calculation based on user behavior
- 🤝 **Endorsement System**: Bidirectional endorsements with monthly limits
- 📝 **Digital Contracts**: PDF-based contracts with e-signatures
- 💰 **Flexible Lending**: Create and browse loan brochures with custom terms
- 📈 **Analytics Dashboard**: Track trust index history and loan performance
- 🔔 **Real-time Notifications**: Stay updated on loan requests, endorsements, and payments
- 💳 **Payment Integration**: PhonePe Standard Checkout (sandbox/mock UPI) for disbursals and repayments

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + SendGrid transactional email for verification links
- **File Storage**: Multer
- **PDF Generation**: pdf-lib
- **Payment**: PhonePe PG SDK (sandbox/mock UPI)

### Frontend

- **Framework**: React
- **Build Tool**: Vite
- **PDF Viewer**: PDF.js
- **Styling**: Tailwind CSS + custom components

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

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
# Core Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=90d

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@fintrustchain.com

# PhonePe Sandbox Credentials
PHONEPE_CLIENT_ID=your_phonepe_client_id
PHONEPE_CLIENT_SECRET=your_phonepe_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_HOST_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_WEBHOOK_USERNAME=WebhookUser
PHONEPE_WEBHOOK_PASSWORD=WebhookPassword
```

Key variables:

- `FRONTEND_URL` is used for CORS and PhonePe redirect URLs.
- `SENDGRID_API_KEY` + `EMAIL_FROM` drive verification emails; the sender must be verified inside SendGrid.
- `PHONEPE_*` values configure the PhonePe PG SDK as well as webhook authentication for `/api/v1/payments/callback`.

### Email Configuration (SendGrid)

1. Create a SendGrid account and complete sender-domain verification.
2. Generate an API key with "Mail Send" permission and copy it into `SENDGRID_API_KEY`.
3. Set `EMAIL_FROM` to the verified sender (e.g., `noreply@fintrustchain.com`).

### PhonePe Sandbox Configuration

1. Register for the PhonePe sandbox and note the `clientId`, `clientSecret`, and `version`.
2. Keep `PHONEPE_HOST_URL` pointing to the sandbox base unless you have production credentials.
3. Choose webhook basic-auth credentials and set `PHONEPE_WEBHOOK_USERNAME` / `PHONEPE_WEBHOOK_PASSWORD`; PhonePe will include them when calling `/api/v1/payments/callback`.

### Client Configuration

1. Navigate to the `client` directory
2. Create a `.env` file:

```env
VITE_API_BASE=http://localhost:3000/api/v1
```

### Setting up MongoDB Atlas

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient for testing)
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace `MONGO_URI` in `.env`

## Running the Project

### Development Mode

```bash
# Terminal 1 – API (nodemon watches server.js)
cd server
npm install
npm start

# Terminal 2 – React client
cd client
npm install
npm run dev
```

### Production Mode

#### Server

```bash
cd server
npm install --production
NODE_ENV=production node server.js
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
├── README.md
├── package.json                 # Root placeholder (no scripts)
├── client/                      # React + Vite frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── public/                  # Static assets served as-is
│   └── src/
│       ├── api/                 # Axios client & endpoint helpers
│       ├── assets/              # Icons, illustrations, fonts
│       ├── components/          # Shared UI widgets
│       ├── context/             # Auth provider
│       ├── pages/               # Route-level screens
│       ├── App.jsx
│       └── main.jsx
└── server/                      # Express API + schedulers
    ├── server.js                # App bootstrap
    ├── package.json
    ├── docker-compose.yml / Dockerfile / render.yaml
    ├── config/                  # Mongo connection, env helpers
    ├── controllers/             # Request handlers
    ├── middlewares/             # Auth + rate limiting
    ├── models/                  # Mongoose schemas
    ├── routes/                  # REST route definitions
    ├── services/                # Business logic (PhonePe, TI math)
    ├── utils/                   # Email, logger, scheduler
    ├── public/
    │   ├── contracts/           # Generated agreements
    │   └── img/                 # User assets (esigns, proofs, users)
    ├── logs/                    # Winston output
    └── .env / .env.production   # Environment configs (local only)
```

## API Endpoints Overview

All API routes are rate-limited and mounted under `http://localhost:3000/api/v1`. A health probe is available at `GET http://localhost:3000/health`.

### Authentication (public)

| Method | Path                               | Description                                              |
| ------ | ---------------------------------- | -------------------------------------------------------- |
| `POST` | `/api/v1/auth/register`            | Register user, upload e-sign PNG, send verification mail |
| `GET`  | `/api/v1/auth/verify-email/:token` | Confirm the emailed token (10 min expiry)                |
| `POST` | `/api/v1/auth/login`               | Issue JWT for subsequent calls                           |

### Users (JWT required)

| Method  | Path                           | Description                                      |
| ------- | ------------------------------ | ------------------------------------------------ |
| `GET`   | `/api/v1/users/me`             | Fetch current user profile + role                |
| `GET`   | `/api/v1/users/:id/public`     | View someone’s public TrustIndex breakdown       |
| `GET`   | `/api/v1/users/:id/private`    | Owner-only dashboard view                        |
| `PATCH` | `/api/v1/users/update-me`      | Update profile data / avatar (multipart)         |
| `POST`  | `/api/v1/users/toggle-my-role` | Switch between LENDER and RECEIVER when eligible |

### Endorsements (JWT)

| Method   | Path                       | Description                              |
| -------- | -------------------------- | ---------------------------------------- |
| `POST`   | `/api/v1/endorsements`     | Create a new endorsement connection      |
| `DELETE` | `/api/v1/endorsements/:id` | Remove endorsement for the given user ID |

### Loan Brochures

| Method   | Path                                  | Auth     | Description                                     |
| -------- | ------------------------------------- | -------- | ----------------------------------------------- |
| `GET`    | `/api/v1/brochures`                   | Optional | List brochures; response adapts if JWT supplied |
| `POST`   | `/api/v1/brochures`                   | LENDER   | Publish a brochure                              |
| `PATCH`  | `/api/v1/brochures/:id`               | LENDER   | Update brochure terms                           |
| `PATCH`  | `/api/v1/brochures/:id/toggle-status` | LENDER   | Activate/deactivate offer                       |
| `DELETE` | `/api/v1/brochures/:id`               | LENDER   | Remove brochure                                 |

### Loan Requests (RECEIVER)

| Method  | Path                               | Description                     |
| ------- | ---------------------------------- | ------------------------------- |
| `GET`   | `/api/v1/loan-requests/my`         | List borrower’s requests        |
| `POST`  | `/api/v1/loan-requests`            | Submit up to three brochure IDs |
| `PATCH` | `/api/v1/loan-requests/:id/cancel` | Cancel before acceptance        |

### Lender Controls (LENDER role)

| Method | Path                                 | Description                                     |
| ------ | ------------------------------------ | ----------------------------------------------- |
| `GET`  | `/api/v1/lender/brochures`           | View brochures authored by the logged-in lender |
| `GET`  | `/api/v1/lender/requests`            | Pending borrower requests awaiting action       |
| `POST` | `/api/v1/lender/requests/:id/accept` | Accept a borrower request (FCFS)                |

### Guarantor Flow (JWT)

| Method  | Path                                 | Description                          |
| ------- | ------------------------------------ | ------------------------------------ |
| `GET`   | `/api/v1/guarantor-requests/pending` | Requests where the user must respond |
| `GET`   | `/api/v1/guarantor-requests/:id`     | Fetch single request                 |
| `POST`  | `/api/v1/guarantor-requests`         | Ask someone to guarantee a loan      |
| `PATCH` | `/api/v1/guarantor-requests/:id`     | Accept or decline                    |

### Contracts & Disbursals (JWT)

| Method | Path                                            | Description                                        |
| ------ | ----------------------------------------------- | -------------------------------------------------- |
| `GET`  | `/api/v1/contracts/:id`                         | Fetch contract metadata + parties                  |
| `GET`  | `/api/v1/contracts/:id/download-pdf`            | Download latest signed PDF                         |
| `GET`  | `/api/v1/contracts/:id/disbursal-proof`         | Download lender proof file (if uploaded)           |
| `GET`  | `/api/v1/contracts/:id/receiver-upi`            | Share receiver UPI info with lender                |
| `POST` | `/api/v1/contracts/:id/sign`                    | Receiver/Guarantor/Lender signs agreement          |
| `POST` | `/api/v1/contracts/:id/initiate-disbursal`      | Generate PhonePe checkout link for disbursal       |
| `POST` | `/api/v1/contracts/:id/confirm-disbursal`       | Legacy manual proof upload                         |
| `POST` | `/api/v1/contracts/:id/confirm-receipt`         | Receiver acknowledges funds                        |
| `POST` | `/api/v1/contracts/:id/guarantor-pay`           | Guarantor settles default share via PhonePe        |
| `POST` | `/api/v1/contracts/admin/trigger-default-check` | Manually run scheduler default logic (admin/debug) |

### Payments (PhonePe)

| Method | Path                        | Auth    | Description                                                   |
| ------ | --------------------------- | ------- | ------------------------------------------------------------- |
| `POST` | `/api/v1/payments/pay`      | JWT     | Initiate EMI payment for a contract                           |
| `POST` | `/api/v1/payments/callback` | Webhook | PhonePe callback secured via basic auth (`PHONEPE_WEBHOOK_*`) |

### Notifications & Dashboard (JWT)

| Method  | Path                                    | Description                               |
| ------- | --------------------------------------- | ----------------------------------------- |
| `GET`   | `/api/v1/notifications`                 | List notifications for the logged-in user |
| `PATCH` | `/api/v1/notifications/:id/read`        | Mark individual notification as read      |
| `GET`   | `/api/v1/dashboard/my-stats`            | Aggregate KPIs for the current role       |
| `GET`   | `/api/v1/dashboard/my-active-contracts` | Contracts needing attention               |
| `GET`   | `/api/v1/dashboard/my-pending-actions`  | Action queue (signatures, payments, etc.) |
| `GET`   | `/api/v1/dashboard/ti-history`          | TrustIndex historical data                |
| `GET`   | `/api/v1/dashboard/my-endorsers`        | Bidirectional endorsement graph           |
| `GET`   | `/api/v1/dashboard/eligible-guarantors` | Suggested guarantors                      |
| `GET`   | `/api/v1/dashboard/eligible-brochures`  | Suggested brochures for borrower          |

## Default Access

After successful installation:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1 (health probe at `/health`)

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Change PORT in server/.env file
PORT=4000
```

**MongoDB connection failed:**

- Verify your MongoDB URI
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

**Email not sending:**

- Confirm `SENDGRID_API_KEY` is set and has "Mail Send" permission
- Ensure the sender identity configured in SendGrid matches `EMAIL_FROM`
- Review server logs for SendGrid response codes (they are logged with the status code)

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
