# GoDaddy Deployment Guide for King Perfumes

Deploying a full-stack application (React/Vite Frontend + Node.js/Express Backend) to GoDaddy requires some configuration, as most GoDaddy shared hosting plans are optimized for PHP. However, you can deploy Node.js apps using cPanel's **"Setup Node.js App"** feature or by using a **GoDaddy VPS**.

This guide focuses on the **cPanel Shared Hosting** approach, which is the most common.

---

## Part 1: Necessary Code Changes Before Deployment

Before you upload any files to GoDaddy, you need to prepare your codebase for the production environment.

### 1. Update Frontend Environment Variables
In your local environment, your frontend talks to `http://localhost:3001`. On GoDaddy, it needs to talk to your live backend domain (e.g., `https://api.yourdomain.com` or `https://yourdomain.com/api`).

- Open `frontend/.env` (or create a `.env.production` file).
- Change the API URL to your future live backend URL:
  ```env
  VITE_API_URL=https://api.yourdomain.com
  ```

### 2. Build the Frontend
GoDaddy doesn't need your React source code; it needs the compiled, optimized static files.

- Open a terminal in the `frontend` directory.
- Run the build command:
  ```bash
  npm install
  npm run build
  ```
- This will generate an output folder (usually `.output/public` or `dist`). These are the files you will upload for the frontend.

### 3. Update Backend Database Configuration (Optional but Recommended)
Your backend is currently using SQLite (`king-perfumes.db`). While SQLite works on cPanel, it is highly recommended to migrate to **MySQL** for a production e-commerce site, as cPanel has built-in MySQL support which is much more robust for concurrent users.
- If you switch to MySQL, you will need to update your backend's `src/database.js` to connect to the GoDaddy MySQL database using credentials provided by GoDaddy.
- If you stick to SQLite, ensure the `.db` file has the correct read/write permissions on the server.

### 4. Adjust Backend Port Configuration
cPanel will assign a dynamic port to your Node.js app through Phusion Passenger. You must ensure your backend listens to the `process.env.PORT` environment variable.

In `backend/src/index.js`, ensure your server starts like this:
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## Part 2: Step-by-Step Deployment on GoDaddy (cPanel)

### Step 1: Deploy the Backend (Node.js API)

1. **Log in to GoDaddy** and go to your **cPanel Admin**.
2. **Create a Subdomain** (Optional but recommended):
   - Go to **Domains** -> **Subdomains**.
   - Create a subdomain like `api.yourdomain.com`. This will act as the root for your backend.
3. **Setup Node.js App**:
   - Scroll down to the **Software** section in cPanel and click on **Setup Node.js App**.
   - Click **Create Application**.
   - **Node.js version**: Select the version that matches your local environment (e.g., 18.x or 20.x).
   - **Application mode**: `Production`.
   - **Application root**: Enter a folder name where your backend will live (e.g., `backend_app`). *Do not put this inside `public_html` for security reasons.*
   - **Application URL**: Select the domain or subdomain you created (e.g., `api.yourdomain.com`).
   - **Application startup file**: `src/index.js` (or just `index.js` if you move it to the root).
   - Click **Create**.
4. **Upload Backend Files**:
   - Go to cPanel **File Manager**.
   - Navigate to the `backend_app` folder you just created.
   - Upload your local `backend` files. **DO NOT upload the `node_modules` folder.**
   - Ensure `package.json`, `src/`, and any other required files are uploaded.
5. **Install Dependencies**:
   - Go back to **Setup Node.js App** in cPanel.
   - Edit your application and click the **Run NPM Install** button. This will install all backend dependencies.
6. **Start the App**:
   - Click **Restart** on the Node.js application. Your API is now live at `api.yourdomain.com`.

### Step 2: Deploy the Frontend (React/Vite)

Since you have built your Vite app into static files, deploying the frontend is very straightforward.

1. **Locate the Build Folder**:
   - On your local machine, find the compiled files inside your `frontend` folder (typically inside `dist` or `.output/public`).
2. **Upload to cPanel**:
   - Go to cPanel **File Manager**.
   - Navigate to the `public_html` folder (this is the root folder for your main domain, `yourdomain.com`).
   - Delete any default GoDaddy files (like `default.html`) if they exist.
   - Upload all the contents of your build folder directly into `public_html`.
3. **Handle Client-Side Routing (Important)**:
   - Because you are using a Single Page Application (SPA), you need to tell GoDaddy's Apache server to route all requests to `index.html`.
   - In the `public_html` folder, create a new file named `.htaccess`.
   - Add the following code to `.htaccess`:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```

### Step 3: Configure CORS (Backend)

Now that your frontend and backend are on different URLs (e.g., `yourdomain.com` and `api.yourdomain.com`), you must configure CORS on your backend so the frontend is allowed to make requests.

In `backend/src/index.js`, update your CORS configuration:
```javascript
const cors = require('cors'); // or import cors from 'cors' if using ES modules
app.use(cors({
    origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
    credentials: true
}));
```
*Make sure to restart your Node.js app from cPanel after making this change.*

---

## Troubleshooting

- **503 Service Unavailable on Backend**: This usually means your Node.js app crashed on startup. Check the logs. You can enable logging in the "Setup Node.js App" cPanel interface or look for a `passenger.log` file.
- **API calls failing from frontend**: Open the browser's Developer Tools (F12) -> Network tab. Check the exact URL it is trying to reach. Ensure it is pointing to your live GoDaddy API URL, not `localhost`.
- **Images not uploading**: If your backend uses `multer` to save images to an `uploads/` folder, make sure that folder exists on the server and has `755` write permissions.

> [!WARNING]
> **VPS vs. Shared Hosting:** If your GoDaddy plan is a standard basic Shared Hosting plan, it might not support the "Setup Node.js App" feature. In that case, you must upgrade to a plan that supports Node.js or switch to a GoDaddy VPS, which gives you root access to install Node.js manually.
