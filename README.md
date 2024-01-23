# secure-comms-hub

Safe Tool for Bank Fraud

Notes to run app as of 23/01/2024:

- SQLite for RDBMS (switched from MySQL)

- Run `npm install` from the project directory to install all the node packages.

- Run `npm run build-db` to create the database on Mac or Linux
  or run `npm run build-db-win` to create the database on Windows

- Run `npm run start` to start serving the web app (Access via http://localhost:3000)

Test the app by browsing to the following routes:

- http://localhost:3000
- http://localhost:3000/agent
- http://localhost:3000/agent/:id
- http://localhost:3000/customer
- http://localhost:3000/customer/:id
- http://localhost:3000/customer/:id/fraud-report

You can also run:
`npm run clean-db` to delete the database on Mac or Linux before rebuilding it for a fresh start
`npm run clean-db-win` to delete the database on Windows before rebuilding it for a fresh start
