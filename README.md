# node-mysql-api-e-commerce marketplace

Node.js + MySQL API for  e-commerce marketplace

Steps to run the project in your local

1. Clone the project into your local directory
2. Go to the project directory
3. Install dependencies by npm install
5. change the mysql configuration in config.json (provide your local mysql credential)
4. Start the server by npm start/node server

The APIs exposed are:
1. /api/auth/register
2. /api/auth/login
3. /api/buyer/list-of-sellers
4. /api/buyer/seller-catalog/:seller_id
5. /api/buyer/create-order/:seller_id
6. /api/seller/create-catalog
7. /api/seller/orders

Test in the postman by appending the lost to the prefix of the endpoints
eg. http://localhost:4000//api/auth/register