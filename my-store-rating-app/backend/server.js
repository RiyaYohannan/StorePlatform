// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── PostgreSQL Connection ────────────────────────────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// ─── Signup Route ─────────────────────────────────────────────────────────────
app.post('/api/signup', async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({ error: 'Name must be 20–60 characters' });
  }
  if (address.length > 400) {
    return res.status(400).json({ error: 'Address max 400 characters' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (
    password.length < 8 ||
    password.length > 16 ||
    !/[A-Z]/.test(password) ||
    !/[^a-zA-Z0-9]/.test(password)
  ) {
    return res.status(400).json({
      error: 'Password must be 8–16 characters, include uppercase and special char'
    });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, name, email, role`,
      [name, email, hashed, address]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Login Route ──────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin Stats Route ────────────────────────────────────────────────────────
app.get('/api/admin/stats', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [usersRes, storesRes, ratingsRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM stores'),
      pool.query('SELECT COUNT(*) FROM ratings')
    ]);

    res.json({
      totalUsers: Number(usersRes.rows[0].count),
      totalStores: Number(storesRes.rows[0].count),
      totalRatings: Number(ratingsRes.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Users List for Admin ─────────────────────────────────────────────────────
app.get('/api/users', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, address, role FROM users ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Store Routes ─────────────────────────────────────────────────────────────
app.get('/api/stores', (req, res) => {
  const stores = [
    { id: 1, name: 'ABC Supermarket', address: '123 Main St', rating: 4.2 },
    { id: 2, name: 'XYZ Grocery', address: '456 Maple Ave', rating: 3.5 },
    { id: 3, name: 'Fresh Mart', address: '789 Oak Blvd', rating: 5.0 }
  ];
  res.json(stores);
});

app.post('/api/stores/:id/rate', authenticate, async (req, res) => {
  const storeId = Number(req.params.id);
  const userId = req.user.id;
  const { rating } = req.body;

  if (!(rating >= 1 && rating <= 5)) {
    return res.status(400).json({ error: 'Rating must be 1–5' });
  }

  try {
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = $3, updated_at = NOW()`,
      [userId, storeId, rating]
    );
    res.json({ message: 'Rating saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/stores/:id/ratings', authenticate, async (req, res) => {
  const storeId = Number(req.params.id);
  const userId = req.user.id;

  try {
    const avgRes = await pool.query(
      `SELECT AVG(rating)::numeric(10,2) AS average
       FROM ratings
       WHERE store_id = $1`,
      [storeId]
    );
    const average = avgRes.rows[0].average || 0;

    const userRes = await pool.query(
      `SELECT rating FROM ratings WHERE store_id = $1 AND user_id = $2`,
      [storeId, userId]
    );
    const userRating = userRes.rows[0]?.rating || null;

    res.json({ average, userRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/owner/dashboard', authenticate, async (req, res) => {
  if (req.user.role !== 'storeOwner') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // Select all stores owned by the current user
    const storesRes = await pool.query(
      `SELECT s.id, s.name, s.address,
              COALESCE(AVG(r.rating), 0)::numeric(10,2) AS average_rating
         FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
        WHERE s.owner_id = $1
     GROUP BY s.id
     ORDER BY s.name`,
      [req.user.id]
    );

    res.json({ stores: storesRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
