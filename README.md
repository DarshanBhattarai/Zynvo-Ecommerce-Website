# Fullstack Authentication System

A robust, production-ready authentication system featuring a custom Node.js/Express backend and a modern React frontend. Supports user registration, login, OAuth (Google & GitHub), role-based access, and more. Designed for easy integration and open-source collaboration.

---

## 🚀 Features

- User registration & login (JWT-based)
- OAuth login (Google, GitHub)
- Password reset via email
- Role-based access control (Admin, Moderator, User)
- Secure session management
- Error handling & logging
- Modern, responsive React UI
- Modular, scalable codebase

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer, Winston
- **Frontend:** React, Vite, Axios, React Router
- **Other:** OAuth2, dotenv, ESLint

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/DarshanBhattarai/authentication.git
cd authentication
```

### 2. Install dependencies

#### Backend

```bash
cd auth-backend
npm install
```

#### Frontend

```bash
cd ../auth-frontend
npm install
```

### 3. Environment Variables

- Copy `.env.example` in both `auth-backend` and `auth-frontend` to `.env` and fill in required values.

### 4. Running in Development

#### Backend

```bash
cd auth-backend
npm run dev
```

#### Frontend

```bash
cd ../auth-frontend
npm run dev
```

### 5. Running in Production

- Build frontend:

```bash
cd auth-frontend
npm run build
```

- Serve backend (ensure it serves the frontend build or use a reverse proxy):

```bash
cd ../auth-backend
npm start
```

---

## 📁 Folder Structure

```
.
├── auth-backend/      # Node.js/Express backend
├── auth-frontend/     # React frontend (Vite)
├── README.md
```

- See each subfolder's README for more details.

---

## 📖 API Documentation

See [`auth-backend/README.md`](./auth-backend/README.md) for detailed API docs.

---

## 🖼️ Screenshots / Demo

Below are placeholders for key UI screens. Replace the image paths with your actual screenshots.

### Signup

![Signup](./auth-frontend/src/assets/screenshots/signUp.png)
_Signup page_

---

### Signin

![Signin](./auth-frontend/src/assets/screenshots/signIn.png)
_Signin page_

---

### Admin Panel

![Admin Panel](./auth-frontend/src/assets/screenshots/admin.png)
_Admin dashboard_

---

> _Add screenshots or a demo link above. Place your images in the `auth-frontend/screenshots/` folder._

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## � License

This project is licensed under the MIT License.

---

## 👤 Author / Contact

- **Darshan Bhattarai**
- [darshan.bhattarai@email.com](mailto:darshan.bhattarai@email.com)
- [GitHub](https://github.com/DarshanBhattarai)
