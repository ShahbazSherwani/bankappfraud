# secure-comms-hub

Safe Tool for Bank Fraud

Notes to run app as (version updated 19/02/2024)

- mySql for RDBMS (switched from SQLITE)

-install mySql database from https://www.mysql.com/downloads/

- Run `npm install` from the project directory to install all the node packages.

- RUN `npm install mysql` to download and install mySql database driver

-Run `mySql` to access mySQL database 

-Run `CREATE` followed by a name for the database for the App e.g., securecomms

-Run `use` followed by the name of database created e.g., use securecomms

-Run `SOURCE` followed by path to the dumpfile /path/to/file.sql to load mySql tables to database

-Run `npm run start` or `node index.js` or `node .` to start serving the web app (Access via http://localhost:3000)

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
