# Auth Backend

The backend for the Fullstack Authentication System. Built with Node.js, Express, and MongoDB, it provides secure authentication, user management, and role-based access APIs.

---

## 🛠️ Tech Stack & Dependencies

- Node.js, Express
- MongoDB, Mongoose
- JWT (jsonwebtoken)
- OAuth2 (Google, GitHub)
- Nodemailer (email)
- Winston (logging)
- dotenv

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in `auth-backend/` with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Run the server

#### Development

```bash
npm run dev
```

#### Production

```bash
npm start
```

---

## 📁 Folder Structure

```
auth-backend/
├── config/         # DB connection & config
├── controllers/    # Route controllers
├── logs/           # Log files
├── middleware/     # Auth, error handling, etc.
├── models/         # Mongoose models
├── routes/         # Express routers
├── services/       # Business logic
├── utils/          # Utilities (email, logger, etc.)
├── index.js        # Entry point
```

---

## 📚 API Documentation

### Authentication

#### Register

- **Endpoint:** `/api/auth/register`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": { "id": "...", "email": "...", ... },
    "token": "jwt_token"
  }
  ```
- **Errors:** `400` (Validation), `409` (Email exists)

#### Login

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token",
    "user": { ... }
  }
  ```
- **Errors:** `401` (Invalid credentials)

#### Google OAuth

- **Endpoint:** `/api/auth/google`
- **Method:** `POST`
- **Body:** `{ "token": "google_id_token" }`
- **Response:** `{ "success": true, "token": "jwt_token", "user": { ... } }`

#### GitHub OAuth

- **Endpoint:** `/api/auth/github`
- **Method:** `POST`
- **Body:** `{ "code": "github_oauth_code" }`
- **Response:** `{ "success": true, "token": "jwt_token", "user": { ... } }`

#### Forgot Password

- **Endpoint:** `/api/auth/forgot-password`
- **Method:** `POST`
- **Body:** `{ "email": "john@example.com" }`
- **Response:** `{ "success": true, "message": "Reset email sent" }`

#### Reset Password

- **Endpoint:** `/api/auth/reset-password`
- **Method:** `POST`
- **Body:** `{ "token": "reset_token", "password": "newpassword" }`
- **Response:** `{ "success": true, "message": "Password reset successful" }`

---

### Error Handling

- All errors return JSON with `success: false` and an `error` message.
- Common error codes: `400`, `401`, `403`, `404`, `409`, `500`.

---

## 🗂️ Folder Explanations

- **controllers/**: Handle request logic for each route.
- **routes/**: Define API endpoints and route to controllers.
- **models/**: Mongoose schemas for users, etc.
- **middleware/**: Auth, error, and async handling.
- **services/**: Business logic, email, OAuth, etc.
- **utils/**: Helper functions (logger, email, config).

---

## 📝 License

MIT

---

## 👤 Author

- **Darshan Bhattarai**
- [darshan.bhattarai@email.com](mailto:darshan.bhattarai@email.com)
