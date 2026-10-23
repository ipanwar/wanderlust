# Wanderlust

Wanderlust is an Express and MongoDB web application for discovering and sharing travel stays. Users can browse listings, view their locations on a map, create and manage their own listings, and leave reviews.

## Features

- Browse listing cards and open listing detail pages.
- Register, log in, and log out with Passport local authentication.
- Create listings with a title, description, price, country, location, and image.
- Edit or delete listings you own.
- Upload listing images to Cloudinary.
- Geocode listing locations with Mapbox and show a map on each listing page.
- Add 1–5 star reviews and delete reviews you authored.
- Validate listing and review submissions with Joi; display success and error messages with flash messages.

## Tech stack

- Node.js and Express 5
- MongoDB with Mongoose
- EJS templates with EJS-Mate layouts
- Passport Local and `passport-local-mongoose`
- Cloudinary for listing image storage
- Mapbox for geocoding and maps

## Requirements

- Node.js and npm
- A MongoDB Atlas database (or another MongoDB deployment reachable through a MongoDB connection string)
- A Cloudinary account
- A Mapbox access token

## Setup

1. Install the dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
   SECRET=replace-with-a-long-random-session-secret
   CLOUD_NAME=your-cloudinary-cloud-name
   CLOUD_API_KEY=your-cloudinary-api-key
   CLOUD_API_SECRET=your-cloudinary-api-secret
   MAP_TOKEN=your-mapbox-access-token
   ```

   Keep this file private; `.env` is excluded by `.gitignore`. `ATLASDB_URL` and `SECRET` are required for database and session setup. Cloudinary credentials are used for listing image uploads, and `MAP_TOKEN` is used for location geocoding and map display.

3. Start the application:

   ```sh
   node app.js
   ```

   The server connects to MongoDB before listening on port `8080`. Open [http://localhost:8080](http://localhost:8080).

For production, provide the same environment variables through the deployment environment. The app loads `.env` with dotenv only when `NODE_ENV` is not `production`.

## Project structure

```text
app.js                 Express app setup, database connection, middleware, and server
cloudconfig.js         Cloudinary configuration and upload storage
controller/            Listing, review, and user request handlers
init/                  Sample listing data and database initialization script
middleware.js          Authentication, ownership, and redirect middleware
models/                Mongoose models for listings, reviews, and users
public/                Client-side JavaScript and CSS, including the map
routes/                Listing, review, and user route definitions
schema.js              Joi validation schemas
utils/                 Express error and async route helpers
views/                 EJS pages, layouts, and shared partials
```

## Routes overview

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/listings` | Browse all listings |
| `GET` | `/listings/new` | Show the create-listing form (login required) |
| `POST` | `/listings` | Create a listing (login required) |
| `GET` | `/listings/:id` | View a listing, reviews, and map |
| `GET` | `/listings/:id/edit` | Edit a listing you own |
| `PUT` | `/listings/:id` | Update a listing you own |
| `DELETE` | `/listings/:id` | Delete a listing you own |
| `POST` | `/listings/:id/reviews` | Add a review (login required) |
| `DELETE` | `/listings/:id/reviews/:reviewID` | Delete a review you authored |
| `GET`, `POST` | `/register`, `/login` | Register or log in |
| `GET` | `/logout` | Log out |

## Sample data

`init/index.js` is a development initialization script, not part of normal application startup. It connects to `mongodb://127.0.0.1:27017/wanderlust`, deletes all listings in that database, and assigns seeded listings a hard-coded owner ID. Review and adjust those values before using it; do not run it against data you need to keep.

## Tests

No automated test suite is configured yet. The current `npm test` script is a placeholder that exits with an error.
