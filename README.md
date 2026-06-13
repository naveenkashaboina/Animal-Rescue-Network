# Animal Rescue Network — MERN Stack

A full-stack MERN application for managing animal rescue listings,
built on the same structure, conventions, and tooling as BLOGAPP.

---

## Project Structure

```
ANIMAL-RESCUE/
├── BACKEND/
│   ├── APIs/
│   │   ├── CommonAPI.js        # register, login, logout, check-auth
│   │   ├── AdopterAPI.js       # browse animals, send inquiries
│   │   ├── RescuerAPI.js       # post, edit, deactivate animals
│   │   └── AdminAPI.js         # manage all animals and users
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── cloudinaryUpload.js
│   │   └── multer.js
│   ├── middlewares/
│   │   └── VerifyToken.js      # JWT role-based auth
│   ├── models/
│   │   ├── UserModel.js        # roles: USER, RESCUER, ADMIN
│   │   └── AnimalModel.js      # species, inquiries subdocument
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── FRONTEND/
    ├── src/
    │   ├── components/
    │   │   ├── RootLayout.jsx
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Home.jsx                 # public animal listings
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── AdopterProfile.jsx       # USER dashboard
    │   │   ├── RescuerProfile.jsx       # RESCUER layout (nested routes)
    │   │   ├── RescuerAnimals.jsx       # rescuer's own animals
    │   │   ├── PostAnimal.jsx           # post new animal
    │   │   ├── EditAnimal.jsx           # edit an animal
    │   │   ├── AnimalByID.jsx           # animal detail + inquiries
    │   │   ├── AdminDashboard.jsx       # ADMIN home
    │   │   ├── AdminNavbar.jsx
    │   │   ├── AllAnimals.jsx           # all animals (admin)
    │   │   ├── ManageUsers.jsx          # block/unblock users
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── AdminProtectedRoute.jsx
    │   │   └── Unauthorized.jsx
    │   ├── store/
    │   │   └── authStore.js             # Zustand auth store
    │   ├── styles/
    │   │   └── common.js                # forest theme tokens
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Roles

| Role      | Access                                              |
|-----------|-----------------------------------------------------|
| USER      | Browse animals, send adoption inquiries             |
| RESCUER   | Post animals, edit and deactivate their own animals |
| ADMIN     | View all animals, block/unblock users and rescuers  |

---

## API Routes Reference

### Auth  (`/auth`)
| Method | Path           | Access  | Description             |
|--------|----------------|---------|-------------------------|
| POST   | /users         | Public  | Register user/rescuer   |
| POST   | /login         | Public  | Login all roles         |
| GET    | /logout        | Public  | Logout                  |
| GET    | /check-auth    | All     | Verify token            |
| PUT    | /password      | All     | Change password         |

### Adopter  (`/adopter-api`)
| Method | Path      | Access | Description              |
|--------|-----------|--------|--------------------------|
| GET    | /animals  | Public | List all active animals  |
| PUT    | /animals  | USER   | Send adoption inquiry    |

### Rescuer  (`/rescuer-api`)
| Method | Path     | Access   | Description             |
|--------|----------|----------|-------------------------|
| POST   | /animal  | RESCUER  | Post new animal         |
| GET    | /animals | RESCUER  | Get own animals         |
| PUT    | /animals | RESCUER  | Edit an animal          |
| PATCH  | /animals | RESCUER  | Activate / deactivate   |

### Admin  (`/admin-api`)
| Method | Path             | Access | Description             |
|--------|------------------|--------|-------------------------|
| GET    | /animals         | ADMIN  | All animals             |
| GET    | /users-rescuers  | ADMIN  | All users and rescuers  |
| PUT    | /state           | ADMIN  | Block / unblock user    |

