
# BookStore Backend

This is the backend server for the BookStore project. It handles APIs, authentication, and integrations such as payment and mailing.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A running instance of MongoDB (local or cloud like MongoDB Atlas)

---

### 📦 Install Dependencies

```bash
npm install
```

---

### ⚙️ Environment Configuration

Create a `.env` file in the root of your backend directory with the following variables:

```env
MONGO_URI=
PORT= 

CLOUD_NAME=
API_KEY=
API_SECRET=

EMAIL_STORE=
EMAIL_PASS=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=
MOMO_REDIRECT_URL=
MOMO_IPN_URL=
MOMO_REQUEST_TYPE=
MOMO_AUTO_CAPTURE=
MOMO_LANG=
```

---

### 🧪 Running the Server

```bash
npm start
```

This will start the backend server using the settings provided in your `.env` file.

---

## 🛠️ Available Scripts

- `npm start`: Run the backend server.

---

## 📂 Project Structure


```
backend/
├── src/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── .env
├── index.js
└── package.json

```

---

