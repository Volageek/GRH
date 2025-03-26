# GRH

C'est une application web permettant de simplifier le travail d'un RH.

## Setup

-   Install Visual Studio Code: [https://code.visualstudio.com/download](https://code.visualstudio.com/download)
-   Install `Live Server` extension for Visual Studio Code
-   Install Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
-   Clone the repository: `git clone https://github.com/Volageek/GRH.git`
-   Install the dependencies: `npm install`
-   Create a .env file at the root of your project (same level as `server.js`)

```
Example:

DB_HOST = "localhost";
DB_USER = "root";
DB_PASSWORD = "";
DB_NAME = "gestion_rh";
```

-   Create a database named: `gestion_rh`
-   Import the database file in your database: `gestion_rh.sql`
-   Launch the server: `npm start`
-   Open `home.html` with `Live Server`
