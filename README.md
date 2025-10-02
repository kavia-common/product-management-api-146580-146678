# product-management-api-146580-146678

Products Backend (Express) - Ocean Professional

- Start (dev): npm run dev
- Start (prod): npm start
- Docs: GET /docs

Environment:
- Copy products_backend/.env.example to products_backend/.env and set HOST, PORT, and PRODUCTS_DATABASE_URL or DATABASE_URL to integrate with products_database (PostgreSQL recommended).
- If no DB URL is provided, the API will use an in-memory store for development.

Endpoints:
/             GET  - Health
/products     GET  - List products
/products     POST - Create product { name, price, quantity }
/products/{id} GET - Get product by id
/products/{id} PUT - Update product (partial updates allowed)
/products/{id} DELETE - Delete product
