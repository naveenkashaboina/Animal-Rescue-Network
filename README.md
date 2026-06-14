# Animal Rescue Network

A full-stack MERN application that connects animal rescuers with potential adopters. Rescuers post animals they have saved, adopters browse listings and send adoption requests, and an admin manages the platform.

---

## Live Links

| | URL |
|---|---|
| Frontend | https://animal-rescue-network-flame.vercel.app |
| Backend | https://animal-rescue-network-fewi.onrender.com |
| Repository | https://github.com/naveenkashaboina/Animal-Rescue-Network |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4 |
| State | Zustand 5 |
| Forms | React Hook Form |
| HTTP | Axios |
| Notifications | React Hot Toast |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose 9 |
| Auth | JWT, bcryptjs |
| Media | Cloudinary, Multer |

---

## Roles

| Role | What they can do |
|---|---|
| USER (Adopter) | Browse animals, send adoption requests, report stray animals, track stray report status |
| RESCUER | Post rescue animals, manage listings, approve or reject adoption requests, claim and convert stray reports |
| ADMIN | View all animals, block and unblock users and rescuers |

---

## Project Structure

```
ANIMAL-RESCUE/
├── BACKEND/
│   ├── APIs/
│   │   ├── CommonAPI.js          register · login · logout · check-auth · change-password
│   │   ├── AdopterAPI.js         browse animals · send request · report stray · my reports
│   │   ├── RescuerAPI.js         post · edit · deactivate · approve · reject · stray reports
│   │   └── AdminAPI.js           all animals · all users · block/unblock
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── cloudinaryUpload.js
│   │   └── multer.js
│   ├── middlewares/
│   │   └── VerifyToken.js
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── AnimalModel.js
│   │   └── StrayReportModel.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── FRONTEND/
    ├── src/
    │   ├── components/
    │   │   ├── RootLayout.jsx
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── AdopterProfile.jsx
    │   │   ├── ReportStray.jsx
    │   │   ├── RescuerProfile.jsx
    │   │   ├── RescuerAnimals.jsx
    │   │   ├── PostAnimal.jsx
    │   │   ├── EditAnimal.jsx
    │   │   ├── AnimalByID.jsx
    │   │   ├── AnimalRequests.jsx
    │   │   ├── StrayReports.jsx
    │   │   ├── ConvertStray.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminNavbar.jsx
    │   │   ├── AllAnimals.jsx
    │   │   ├── ManageUsers.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── AdminProtectedRoute.jsx
    │   │   └── Unauthorized.jsx
    │   ├── store/
    │   │   └── authStore.js
    │   ├── styles/
    │   │   └── common.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Step 1 — Clone the repo

```bash
git clone https://github.com/naveenkashaboina/Animal-Rescue-Network.git
cd Animal-Rescue-Network
```

### Step 2 — Backend environment variables

Create `BACKEND/.env`:

```
PORT=4001
DB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=ANIMAL-RESCUE
SECRET_KEY=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Step 3 — Frontend environment variables

Create `FRONTEND/.env`:

```
VITE_API_URL=http://localhost:4001
```

### Step 4 — Install and run the backend

```bash
cd BACKEND
npm install
nodemon server
```

Server starts at http://localhost:4001

### Step 5 — Install and run the frontend

```bash
cd FRONTEND
npm install
npm run dev
```

App opens at http://localhost:5173

### Step 6 — Seed the admin account

The registration form only allows USER and RESCUER roles. Use Postman or Thunder Client to create the admin directly:

```
POST http://localhost:4001/auth/users
Content-Type: application/json

{
  "firstName": "Admin",
  "email": "admin@rescue.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

---

## Deployment

### Backend — Render

Environment variables to set in the Render dashboard:

```
PORT=4001
DB_URL=<your atlas connection string>
SECRET_KEY=<your secret>
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>
FRONTEND_URL=https://animal-rescue-network-flame.vercel.app
```

Build command: _(none — Node.js, no build step)_
Start command: `node server.js`

### Frontend — Vercel

Environment variables to set in the Vercel dashboard:

```
VITE_API_URL=https://animal-rescue-network-fewi.onrender.com
```

After adding the variable, go to **Deployments → Redeploy** since Vite bakes env variables at build time.

---

## API Reference

### Auth `/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | /users | Public | Register USER or RESCUER |
| POST | /login | Public | Login, returns JWT |
| GET | /logout | Public | Stateless logout |
| GET | /check-auth | All roles | Validate token |
| PUT | /password | All roles | Change password |

### Adopter `/adopter-api`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | /animals | Public | All active animals |
| PUT | /animals | USER | Send adoption request |
| POST | /stray-report | USER | Submit stray animal report |
| GET | /my-stray-reports | USER | Get own stray reports with status |

### Rescuer `/rescuer-api`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | /animal | RESCUER | Post new animal |
| GET | /animals | RESCUER | Get own animals |
| PUT | /animals | RESCUER | Edit an animal |
| PATCH | /animals | RESCUER | Activate or deactivate |
| GET | /animal/:id/requests | RESCUER | All adoption requests for an animal |
| PUT | /inquiry/approve | RESCUER | Approve one request, reject all others, mark animal Adopted |
| PUT | /inquiry/reject | RESCUER | Reject a single request |
| GET | /stray-reports | RESCUER | Open and claimed stray reports |
| PUT | /stray-reports/claim | RESCUER | Claim an open stray report |
| POST | /stray-reports/convert | RESCUER | Convert claimed report into an In Care animal listing |

### Admin `/admin-api`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | /animals | ADMIN | All animals including inactive |
| GET | /users-rescuers | ADMIN | All USER and RESCUER accounts |
| PUT | /state | ADMIN | Block or unblock a user |

---

## Home Page Layout

Animals are displayed in three color-coded sections:

| Section | Color | Meaning |
|---|---|---|
| Available for Adoption | Green cards | Ready to be adopted |
| Under Care | Yellow cards | Rescued, receiving care |
| Successfully Adopted | Pink cards | Already found a home |

---

## Stray Animal Workflow

```
User spots stray → submits report (species, location, photo)
  ↓
Report appears in rescuer's Stray Reports tab
  ↓
Rescuer claims it → status becomes Claimed
  ↓
User sees "A rescuer is on their way" in their profile
  ↓
Rescuer rescues animal → converts report to animal listing
  ↓
Animal appears in In Care section on home page
  ↓
User sees "Rescued and added to listings" in their profile
```

## Adoption Workflow

```
Adopter finds animal on home page → clicks Request Adoption
  ↓
Rescuer sees pending request count on their animal card
  ↓
Rescuer opens Requests page → reads all messages
  ↓
Rescuer clicks Approve on one request
  ↓
All other requests auto-rejected
  ↓
Animal status flips to Adopted
  ↓
Approved adopter sees success message on animal page
  ↓
Animal moves to pink Adopted section on home page
```