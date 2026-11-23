# NamlaTech | Hotel Management System

A full-stack Hotel Management System built using React.js, Node.js, Express.js, and PostgreSQL. The application allows users to manage hotel records through a simple and responsive interface.

## 🚀 Features

- **Hotel Management:** Add, view, edit, and delete hotel records.
- **Image Upload:** Upload and preview hotel images.
- **Search:** Search hotels by title.
- **Price Filtering:** Filter hotels based on price range.
- **Pagination:** Browse hotel listings across multiple pages.
- **Hotel Details:** View complete hotel information, including location coordinates.
- **Map Integration:** Display hotel locations using latitude and longitude.
- **Form Validation:** Validate hotel information before submission.
- **Responsive UI:** Clean interface for convenient navigation.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Redux | State management |
| JavaScript | Application logic |
| CSS | UI styling |
| Node.js | Backend runtime |
| Express.js | REST API development |
| PostgreSQL | Database |
| Multer | Image upload handling |
| Axios | API communication |
| React Router | Page navigation |

## 📁 Project Structure

```text
NamlaTech/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── hotelController.js
│   ├── middleware/
│   │   └── upload.js
│   ├── routes/
│   │   └── hotelRoutes.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
│
└── .gitignore
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sanjayganeshsg/NamlaTech.git
cd NamlaTech
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure your PostgreSQL connection details.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

Create the required PostgreSQL database and configure the hotel table according to the backend implementation.

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will display its local URL in the terminal.

## 🔗 API Endpoints

Base URL: `http://localhost:5000/api/hotels`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hotels` | Retrieve hotel records |
| GET | `/api/hotels/:id` | Retrieve a hotel by ID |
| POST | `/api/hotels` | Add a new hotel |
| PUT | `/api/hotels/:id` | Update hotel details |
| DELETE | `/api/hotels/:id` | Delete a hotel |

The listing API also supports search, price filtering, and pagination.

## 🗄️ Database

NamlaTech uses PostgreSQL to store hotel information, including:

- Hotel ID
- Hotel title
- Description
- Latitude
- Longitude
- Price
- Image information

## 🔮 Future Enhancements

- User authentication and authorization
- Advanced hotel filtering
- Hotel booking functionality
- Dashboard analytics
- Improved deployment and cloud image storage

## 👨‍💻 Developer

**Sanjayganesh S**

GitHub: [@sanjayganeshsg](https://github.com/sanjayganeshsg)

---

⭐ If you find this project useful, consider giving the repository a star!