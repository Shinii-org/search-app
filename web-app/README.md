# Project Setup

## Overview
This document provides step-by-step instructions for configuring and running the application in both development and production environments. Follow these steps to ensure the application is set up correctly.

---

## Configuration

### `.env` File Setup
Copy the following configurations into a `.env` file located at the root of your project:

```env
DATABASE_URL=postgresql://postgres:123@localhost:5432/mydb
AUTH_SECRET=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_TRUST_HOST=true

NEXT_PUBLIC_URL=http://localhost:3000/
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_SCHEME=http://

NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### Generate `AUTH_SECRET`
To generate the `AUTH_SECRET`, run the following command:

```bash
npx auth secret
```

Copy the generated `AUTH_SECRET` from `.env.local` to `.env`.

---

## GitHub OAuth Setup

Follow these steps to obtain `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`:

1. **Access GitHub**: Go to [GitHub](https://github.com), and click your profile picture in the top-right corner.
   
   ![GitHub Profile](./public/github-auth-1.png)

2. **Go to Settings**: Select **Settings** from the dropdown menu.

   ![Settings](./public/github-auth-2.png)

3. **Navigate to Developer Settings**: Scroll down and select **Developer Settings** in the left sidebar.

   ![Developer Settings](./public/github-auth-3.png)

4. **OAuth Apps**: Under **Developer Settings**, select **OAuth Apps**.

5. **Create a New OAuth App**: Click **New OAuth App** and fill in the required information.

   ![New OAuth App](./public/github-auth-4.png)

6. **Register the Application**: Complete the registration process by clicking **Register Application**.

7. **Generate Client Secret**: After registering the app, click **Generate a new client secret**.

   ![Generate Client Secret](./public/github-auth-5.png)

8. **Copy the Credentials**:
   - **Client ID**: Copy and paste this value into `AUTH_GITHUB_ID` in your `.env` file.
   - **Client Secret**: Copy and paste this value into `AUTH_GITHUB_SECRET` in your `.env` file.

9. **Update Application**: Save your changes.

   ![Update Application](./public/github-auth-6.png)

---

## Running the Application

### Development Mode
To run the application in development mode:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

The server will be accessible at `http://localhost:3000`.

### Production Mode
To run the application in production mode:

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

The server will be accessible at `http://localhost:3000`.

---
