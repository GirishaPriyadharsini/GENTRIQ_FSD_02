# GENTRIQ_FSD_02

Personal Finance Dashboard (Task 2)

## 📌 Project Overview

The **Personal Finance Dashboard** is a full-stack web application designed to help users manage their personal finances efficiently. It allows users to track income and expenses, categorize transactions, and visualize financial data through interactive charts. The application ensures secure data storage and user authentication.

---

## Features

* User registration and login with JWT authentication
* Add, edit, and delete income & expense transactions
* Categorize transactions (income & expense categories)
* Monthly financial overview dashboard
* Interactive charts using Chart.js
* Dashboard summary (total income, expenses, balance)
* Recent transactions list
* Secure backend with MySQL database

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Chart.js
* Font Awesome

### Backend

* Node.js
* Express.js
* JWT (JSON Web Token) for authentication
* bcrypt.js for password hashing

### Database

* MySQL

---

## Project Structure

```
FINANCE-DASHBOARD/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── styles.css
│   └── dashboard.css
│
├── database/
│   └── finance_dashboard.sql
│
├── server.js
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd finance-dashboard
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file:

```env
JWT_SECRET=your_secret_key
```

### 4️⃣ Setup Database

* Import `finance_dashboard.sql` into MySQL
* Update database credentials in `server.js`

```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'finance_dashboard'
});
```

### 5️⃣ Run the Application

```bash
node server.js
```

Server will run at:

```
http://localhost:3000
```

---

## 📊 Dashboard Functionalities

* **Summary Cards**: Total Income, Total Expenses, Balance
* **Monthly Overview Chart**: Income vs Expenses
* **Category-wise Expense Chart**
* **Transaction Management**: Add, edit, delete
* **Filters**: Month, year, category, date range

---

## 🔐 Security

* Passwords are securely hashed using bcrypt
* JWT-based authentication for protected routes
* User-specific data access

---

## 🎯 Task Fulfillment

✔ Add income
✔ Add expenses
✔ Categorize transactions
✔ Monthly charts overview
✔ Dashboard summary
✔ Secure backend data storage
✔ MySQL database integration

---

## 🧑‍💻 Author

**Task 2 – Full Stack Development Assignment**
Personal Finance Dashboard

---
