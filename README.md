#  Personal Money Tracker

Α simple full-stack personal budget tracker that helps users register, log in, manage their expenses, and visualize spending habits.

---

##  Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Google OAuth
- **Logging**: Winston
- **Documentation**: Swagger

---

##  Features

- **User Authentication**
  - Register and log in using username and password
  - Login with Google (OAuth2)

- **Expense Tracking**
  - Add, edit, and delete personal expenses
  - Categorize expenses for better budgeting
  - Get a real-time financial summary (income, expenses, balance)

- **Secure Access**
  - JWT-based authentication
  - Password hashing with bcrypt

- **Logging and Monitoring**
  - Logs stored using Winston with daily file rotation
  - MongoDB logging for warnings and errors

- **Interactive API Docs**
  - Swagger UI documentation at `/api-docs`

---

## Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based)
- A Google Cloud Project (for OAuth2 authentication)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   In the root directory, create a `.env` file and add your environment variables:

   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   ```

4. **Start MongoDB**  
   If using local MongoDB, make sure the service is running.  
   For cloud MongoDB (e.g., MongoDB Atlas), ensure your IP is whitelisted.

###  Run the App

```bash
npm run dev
```

Your server should now be running at:

```
http://localhost:3000
```

###  View API Documentation

Once the app is running, you can view and test all the API endpoints using Swagger:

```
http://localhost:3000/api-docs
```

---