# Simple URL Shortener

This project is a URL shortener built using **Node.js**, **Express.js**, **MongoDB**, and **EJS** as the view engine. It allows users to shorten long URLs, set an optional expiration date for the shortened URLs, and view paginated lists of their URLs. 

## Features
- Shorten long URLs
- Optionally set an expiration date for shortened URLs
- Click count tracking for each shortened URL

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Project Structure](#project-structure)
4. [Routes](#routes)
5. [Middleware](#middleware)
6. [Controller Logic](#controller-logic)
7. [License](#license)

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up MongoDB**:
   - You will need a MongoDB instance running. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud MongoDB or run MongoDB locally.
   - Create a `.env` file in the project root and add your MongoDB connection string:

     ```
     MONGODB_URI=mongodb://localhost:27017/urlShortenerDB
     ```

4. **Start the server**:

   ```bash
   npm start
   ```

5. **Visit the application**:
   - Open your browser and go to `http://localhost:3000`.

---

## Usage

### Shortening a URL
1. Enter a long URL and an optional expiration date.
2. Click "Shorten" to generate a shortened URL.
3. The shortened URL will appear, along with a paginated list of previously shortened URLs.

### Expiration Rules
- If no expiration date is provided, the URL will be valid indefinitely.
- If the expiration date is in the past, the system will reject the entry with an error message.
- Existing URLs with the same long URL and expiration date will not be duplicated; the existing shortened URL will be returned instead.

### Pagination
- The system displays 5 shortened URLs per page.
- Users can navigate between pages to view all shortened URLs.

### Redirecting
- When visiting a shortened URL, the user will be redirected to the original long URL if the shortened URL is still valid and not expired.

---

## Routes

### GET `/`
- **Description**: Fetches the homepage with a paginated list of URLs.
- **Query Params**: 
  - `page`: (optional) Current page number for pagination (default: `1`).
- **Response**: Renders the `index.ejs` view with the list of shortened URLs and pagination controls.

### POST `/shorten`
- **Description**: Shortens a long URL and optionally sets an expiration date.
- **Body Params**:
  - `longUrl`: (required) The original long URL to be shortened.
  - `expiresAt`: (optional) Expiration date for the shortened URL (must be in the future).
- **Validation**: Prevents URLs with past expiration dates from being created.
- **Response**: Renders the `index.ejs` view with the shortened URL and an updated paginated list.

### GET `/:shortUrl`
- **Description**: Redirects the user to the original long URL if the shortened URL is still valid and has not expired.
- **Params**:
  - `shortUrl`: The shortened URL code to be looked up in the database.
- **Response**: Redirects to the long URL or returns an error if the shortened URL has expired or does not exist.

---