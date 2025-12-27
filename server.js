const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'finance_dashboard'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes

// 1. User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const [existing] = await db.promise().query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await db.promise().query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );

        const defaultCategories = [
            ['Salary', 'income', '#2ecc71'],
            ['Freelance', 'income', '#3498db'],
            ['Investment', 'income', '#9b59b6'],
            ['Food & Dining', 'expense', '#e74c3c'],
            ['Transportation', 'expense', '#f39c12'],
            ['Shopping', 'expense', '#d35400'],
            ['Entertainment', 'expense', '#8e44ad'],
            ['Bills & Utilities', 'expense', '#34495e'],
            ['Healthcare', 'expense', '#16a085']
        ];

        for (const [name, type, color] of defaultCategories) {
            await db.promise().query(
                'INSERT INTO categories (user_id, name, type, color) VALUES (?, ?, ?, ?)',
                [result.insertId, name, type, color]
            );
        }

        const token = jwt.sign(
            { id: result.insertId, username, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'User registered successfully',
            token,
            user: { id: result.insertId, username, email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [users] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. Get user categories
app.get('/api/categories', authenticateToken, async (req, res) => {
    try {
        const [categories] = await db.promise().query(
            `SELECT * FROM categories 
             WHERE user_id = ? OR user_id IS NULL 
             ORDER BY user_id DESC, type, name`,
            [req.user.id]
        );
        res.json(categories);
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. Create new category
app.post('/api/categories', authenticateToken, async (req, res) => {
    try {
        const { name, type, color } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({ error: 'Name and type are required' });
        }

        const [existing] = await db.promise().query(
            'SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ?',
            [req.user.id, name, type]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const [result] = await db.promise().query(
            'INSERT INTO categories (user_id, name, type, color) VALUES (?, ?, ?, ?)',
            [req.user.id, name, type, color || '#3498db']
        );

        res.json({
            message: 'Category added successfully',
            categoryId: result.insertId
        });
    } catch (error) {
        console.error('Add category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. Add transaction
app.post('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const { category_id, amount, type, description, transaction_date } = req.body;
        
        if (!category_id || !amount || !type || !transaction_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be positive' });
        }

        const [result] = await db.promise().query(
            `INSERT INTO transactions 
             (user_id, category_id, amount, type, description, transaction_date) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, category_id, amount, type, description || '', transaction_date]
        );

        res.json({
            message: 'Transaction added successfully',
            transactionId: result.insertId
        });
    } catch (error) {
        console.error('Add transaction error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 6. Get transactions with filters
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate, type, category_id, limit } = req.query;
        let query = `
            SELECT t.*, c.name as category_name, c.color as category_color 
            FROM transactions t 
            JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = ?
        `;
        const params = [req.user.id];

        if (startDate) {
            query += ' AND t.transaction_date >= ?';
            params.push(startDate);
        }
        if (endDate) {
            query += ' AND t.transaction_date <= ?';
            params.push(endDate);
        }
        if (type) {
            query += ' AND t.type = ?';
            params.push(type);
        }
        if (category_id) {
            query += ' AND t.category_id = ?';
            params.push(category_id);
        }

        query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';
        
        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [transactions] = await db.promise().query(query, params);
        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 7. Delete transaction
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const [result] = await db.promise().query(
            'DELETE FROM transactions WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 8. Get dashboard summary - FIXED VERSION
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query;
        
        // Build date conditions
        let dateCondition = '';
        let dateParams = [];
        
        if (month && year) {
            dateCondition = ' AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?';
            dateParams = [parseInt(month), parseInt(year)];
        }

        // Total income
        const [incomeResult] = await db.promise().query(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM transactions 
             WHERE user_id = ? AND type = 'income'${dateCondition}`,
            [userId, ...dateParams]
        );

        // Total expenses
        const [expenseResult] = await db.promise().query(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM transactions 
             WHERE user_id = ? AND type = 'expense'${dateCondition}`,
            [userId, ...dateParams]
        );

        // Balance
        const balance = incomeResult[0].total - expenseResult[0].total;

        // Recent transactions
        const [recentTransactions] = await db.promise().query(
            `SELECT t.*, c.name as category_name, c.color as category_color 
             FROM transactions t 
             JOIN categories c ON t.category_id = c.id 
             WHERE t.user_id = ? 
             ORDER BY t.transaction_date DESC, t.created_at DESC
             LIMIT 5`,
            [userId]
        );

        // Category-wise expenses - FIXED QUERY
        let categoryQuery = `
            SELECT c.id, c.name, c.color, COALESCE(SUM(t.amount), 0) as total 
            FROM categories c 
            LEFT JOIN transactions t ON c.id = t.category_id 
                AND t.user_id = ? 
                AND t.type = 'expense'
        `;
        
        const categoryParams = [userId];
        
        if (month && year) {
            categoryQuery += ' AND MONTH(t.transaction_date) = ? AND YEAR(t.transaction_date) = ?';
            categoryParams.push(parseInt(month), parseInt(year));
        }
        
        categoryQuery += `
            WHERE (c.user_id = ? OR c.user_id IS NULL) 
                AND c.type = 'expense'
            GROUP BY c.id, c.name, c.color
            HAVING total > 0
            ORDER BY total DESC
        `;
        
        categoryParams.push(userId);
        
        const [categoryExpenses] = await db.promise().query(categoryQuery, categoryParams);

        res.json({
            totalIncome: parseFloat(incomeResult[0].total),
            totalExpenses: parseFloat(expenseResult[0].total),
            balance: parseFloat(balance),
            recentTransactions,
            categoryExpenses
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 9. Get monthly overview data
app.get('/api/dashboard/monthly-overview', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { year } = req.query || new Date().getFullYear();
        
        const query = `
            SELECT 
                MONTH(transaction_date) as month,
                YEAR(transaction_date) as year,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
            FROM transactions 
            WHERE user_id = ? 
                AND YEAR(transaction_date) = ?
            GROUP BY YEAR(transaction_date), MONTH(transaction_date)
            ORDER BY year, month
        `;

        const [results] = await db.promise().query(query, [userId, year]);
        res.json(results);
    } catch (error) {
        console.error('Monthly overview error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 10. Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.promise().query(
            'SELECT id, username, email, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(users[0]);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 11. Update transaction
app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const { category_id, amount, description, transaction_date } = req.body;
        
        if (!category_id || !amount || !transaction_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const [result] = await db.promise().query(
            `UPDATE transactions 
             SET category_id = ?, amount = ?, description = ?, transaction_date = ?
             WHERE id = ? AND user_id = ?`,
            [category_id, amount, description || '', transaction_date, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Serve frontend for any other route
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});