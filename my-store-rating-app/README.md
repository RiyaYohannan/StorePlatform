**Project Overview**
This is a full-stack Store Rating web application that allows:
1.Normal Users to register, login, browse stores, and submit ratings (1–5 stars).
2.Store Owners to login, view their own stores, and see average ratings.
3.Admins to manage users and stores, view site-wide statistics, and filter listings.
The frontend is built with React (Vite), using React Router for navigation and Context API for authentication.The backend uses Node.js with Express, PostgreSQL for data storage, and JWT for authentication.

**Approach & Functionality**

**Authentication & Authorization**
1.Signup/Login endpoints (/api/signup, /api/login) with validation & bcrypt hashing.
2.JWT-based auth:tokens stored in localStorage, attached as Authorization: Bearer <token>.
Role-based access via ProtectedRoute in React and middleware on server.

**Frontend Pages**
1.Home: Hero banner + features.
2.Signup/Login: Forms with validation and styled feedback.
3.Dashboard: Role-specific links.
4.Store List: Searchable, rating-enabled cards.
5.Admin Users/Stores: Tables with search/filter.
6.Store Owner Dashboard: Cards for owner’s stores.

**Backend API**
1.Users: users table, roles (user, storeOwner, admin).
2.Stores: stores table, linked to owner.
3.Ratings: ratings table, one per user-store.
4.Endpoints for CRUD and stats: /api/stores, /api/stores/:id/ratings, /api/admin/stats, etc.
