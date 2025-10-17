
## Full Bin Detection – Local Setup

A guide to run the project locally (Node.js server + Vite React client).

Create .env file inside server:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_database_password
    DB_NAME=full_bin_project

To install dependencies, open your terminal and run these commands one by one:

1.  Navigate to the server folder and install dependencies:
    cd server
    npm install

2.  Move to the client folder and install dependencies:
    cd ../client
    npm install

Run the server:
    cd server && node app.js
    Server runs at http://localhost:3000

Run the client:
    cd client && npm run dev
    Client runs at http://localhost:5173


## Authors

- [@LiadVardi](https://github.com/LiadVardi)
- [@OrBittoun](https://github.com/OrBittoun)
- [@Dianavain](https://github.com/Dianavain)
- [@idoelarat](https://github.com/idoelarat)