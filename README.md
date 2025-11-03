# International Payment Portal - Customer Portal

A secure customer-facing international payment system built with React. This application enables customers to register, login, and submit international payment requests via SWIFT with comprehensive security measures.

ST10252644 - Cherika Bodde

ST10322054 - Nathan Hani

ST10399538 - Inge Dafel

## Video Demonstration

**Watch the youtube video here:** https://youtu.be/X2jP8W20V9I

---

## Features

### Customer Portal Functionality
- **Secure User Registration**
  - User registration with full name, ID number, account number, username, and password
  - Client-side validation using Yup schema validation
  - Server-side validation with RegEx whitelisting
  
- **Secure Authentication**
  - Login with username and password
  - Password hashing and salting using bcrypt
  - Session management with secure cookies
  - Password visibility toggle for better UX
  
- **International Payment Submission**
  - Submit payment requests with amount, currency (ZAR/USD/EUR), and SWIFT details
  - Input validation using RegEx patterns to prevent injection attacks
  - Real-time form validation with Formik and Yup
  - Visual feedback for successful/failed submissions

### Security Features (Task 2 Requirements)

#### 1. Password Security - Hashing and Salting
- All passwords are hashed using **bcrypt** with automatic salting
- Passwords are never stored in plain text
- Password strength requirements enforced:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

#### 2. Input Whitelisting with RegEx Patterns
All user inputs are validated using strict RegEx patterns on both client and server:
```javascript
Full Name: /^[A-Za-z\s\-'\.]{2,100}$/
ID Number: /^\d{10,20}$/
Account Number: /^\d{6,20}$/
Username: /^[a-zA-Z0-9]{4,}$/
Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
SWIFT Code: /^[A-Za-z0-9]{8,11}$/
Payee Account: /^\d{6,20}$/
```

#### 3. SSL/TLS Encryption
- All traffic is served over **HTTPS** using SSL/TLS certificates
- Self-signed certificates used for development
- Certificate and key files stored in `/server/certs/`
- Backend server runs on HTTPS port 443
- Frontend development server configured for HTTPS

#### 4. Protection Against Attacks
The application is hardened against multiple attack vectors:

- **SQL Injection**: Input validation and parameterized queries
- **Cross-Site Scripting (XSS)**: Input sanitization and Content Security Policy headers
- **Cross-Site Request Forgery (CSRF)**: CSRF tokens and SameSite cookie attributes
- **Session Hijacking**: Secure session management with HTTPOnly and Secure cookies
- **Clickjacking**: X-Frame-Options header set to DENY
- **Man-in-the-Middle (MITM)**: SSL/TLS encryption for all communications
- **DDoS Attacks**: Rate limiting with express-brute
- **Brute Force Attacks**: Login attempt throttling

---

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing and navigation
- **Formik** - Form state management and handling
- **Yup** - Client-side schema validation
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with gradients, animations, and glassmorphism effects

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **bcrypt** - Password hashing and salting
- **express-validator** - Server-side input validation
- **helmet** - Security headers middleware
- **express-brute** - Rate limiting and brute-force protection
- **cors** - Cross-Origin Resource Sharing configuration
- **MongoDB/MySQL** - Database for storing user data and payments

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB or MySQL database

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd INSY7312-TASK-2-main
```

2. **Install Server Dependencies**
```bash
cd server
npm install
```

3. **Install Client Dependencies**
```bash
cd ../client
npm install
npm install axios yup
```

4. **Generate SSL Certificates**
```bash
cd server/certs
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

5. **Configure Environment Variables**

Create a `.env` file in the `server` directory:
```env
PORT=443
DB_CONNECTION_STRING=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

6. **Start the Backend Server**
```bash
cd server
node index.js
```

You should see:
```
DB synced
HTTPS server running on port 443
```

7. **Start the Frontend Development Server**
```bash
cd client
npm run dev
```

You should see:
```
VITE v7.1.7 ready in 891 ms
Local: https://localhost:5173/
```

8. **Access the Application**
- Frontend: `https://localhost:5173`
- Backend API: `https://localhost:443`

**Note**: You may need to accept the security warning in your browser due to the self-signed SSL certificate.

---

## Project Structure

```
INSY7312-TASK-2-main/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # Axios configuration with base URL
│   │   ├── pages/
│   │   │   ├── Register.jsx  # Customer registration page
│   │   │   ├── Login.jsx     # Customer login page
│   │   │   └── Dashboard.jsx # Payment submission page
│   │   ├── App.jsx           # Main app component with routing
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # React entry point
│   ├── certs/                # SSL certificates (if needed)
│   ├── package.json
│   └── vite.config.js        # Vite HTTPS configuration
│
├── server/                    # Node.js/Express backend
│   ├── certs/
│   │   ├── cert.pem          # SSL certificate
│   │   └── key.pem           # SSL private key
│   ├── routes/
│   │   ├── auth.js           # Registration and login routes
│   │   └── payments.js       # Payment submission routes
│   ├── models/               # Database models
│   ├── middleware/           # Security middleware
│   ├── index.js              # Server entry point
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Authentication
- **POST** `/api/auth/register`
  - Registers a new customer
  - Request body: `{ fullName, idNumber, accountNumber, username, password }`
  - Returns: Success message or error

- **POST** `/api/auth/login`
  - Authenticates a customer
  - Request body: `{ username, password }`
  - Returns: Session token and user data

### Payments
- **POST** `/api/payments`
  - Submits a new payment request
  - Requires authentication
  - Request body: `{ amount, currency, provider, payeeAccount, swiftCode }`
  - Returns: Payment confirmation with status "pending"

---

## Testing Instructions

Follow these steps to test the customer portal:



### Demo Accounts

You can use these pre-created accounts to test the system:

| Role | Username | Password |
|------|-----------|-----------|
| Customer | susan | SuSanSmith!3 |
| Employee | staff1 | EmployeeP@ss1 |

You may also register your own test account if needed.





### Step 1 — Start the Application
1. Run both the server and client locally.  
2. Open the browser and go to:  
   `https://localhost:5173`



### Step 2 — Login as Customer
1. On the login page, enter:
   - Username: `susan`
   - Password: `SuSanSmith!3`
2. Click **Sign In**  
3. You will be redirected to the Dashboard.



### Step 3 — Submit a Payment
1. On the Dashboard, complete the payment form:
   - Amount: `1000` (or any amount)
   - Currency: `ZAR` / `USD` / `EUR`
   - Provider: `SWIFT`
   - Payee Account Number: `123456778`
   - SWIFT Code: `ABCDUS33XXX`
2. Click **Submit Payment**  
3. A message should appear:  
   *“Payment created successfully! Status: Pending verification.”*

4. Log out after the payment is created.



### Step 4 — Login as Employee
1. On the login page, enter:
   - Username: `staff1`
   - Password: `EmployeeP@ss1`
2. Click **Sign In**  
3. You will be redirected to the Employee Dashboard.



### Step 5 — Approve the Payment
1. Locate the payment created by `susan` (or the test user).  
2. Review the details.  
3. Approve or verify the payment as required.  
4. Confirm that the payment status updates to *Approved* or *Verified*.



### Step 6 — Security and Validation Checks
- Test invalid inputs to confirm validation messages appear.  
- Confirm the password input hides characters correctly.  
- Ensure the connection uses HTTPS (`https://` in address bar).  
- Try SQL-injection-style inputs (only in local testing) to confirm protection.

---

## Security Implementation Details

### Password Hashing (bcrypt)
```javascript
// Server-side password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// During registration
const hashedPassword = await bcrypt.hash(password, saltRounds);

// During login
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
```

### Input Validation (RegEx)
```javascript
// Client-side validation with Yup
const schema = Yup.object({
  fullName: Yup.string()
    .matches(/^[A-Za-z\s\-'\.]{2,100}$/, 'Invalid name')
    .required('Required'),
  password: Yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'Weak password')
    .required('Required')
});

// Server-side validation mirrors client-side patterns
```

### SSL/TLS Configuration
```javascript
// Server setup with HTTPS
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(options, app).listen(443);
```

### Attack Protection Middleware
```javascript
// Helmet for security headers
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));

// CORS configuration
app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true
}));

// Rate limiting with express-brute
const bruteforce = new ExpressBrute(store);
app.post('/api/auth/login', bruteforce.prevent, loginHandler);
```

---

## Task 2 Requirements Checklist

- [x] **Password security enforced with hashing and salting** (bcrypt implementation)
- [x] **All input whitelisted using RegEx patterns** (client and server-side validation)
- [x] **All traffic served over SSL** (HTTPS on both frontend and backend)
- [x] **Protection against all attacks**:
  - [x] SQL Injection
  - [x] XSS (Cross-Site Scripting)
  - [x] CSRF (Cross-Site Request Forgery)
  - [x] Session Hijacking
  - [x] Clickjacking
  - [x] Man-in-the-Middle
  - [x] DDoS/Brute Force
- [x] **Video demonstration** (YouTube link provided above)

---

## Known Issues & Considerations

- **Self-signed SSL certificates**: Browser will show security warnings in development. Click "Advanced" and "Proceed to localhost" to continue.
- **Port 443**: May require administrator/sudo privileges to run the server on port 443.
- **Database connection**: Ensure your database is running before starting the server.
- **CORS**: Frontend must run on `https://localhost:5173` for proper CORS configuration.

---

---

## References

Beijer, M de 2019, *Yup validation and TypeScript (and Formik)*, Medium, viewed 6 October 2025, <https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e>.

CSS-Tricks 2023, *A Complete Guide to Flexbox*, CSS-Tricks, viewed 6 October 2025, <https://css-tricks.com/snippets/css/a-guide-to-flexbox/>.

CSS-Tricks 2023, *A Complete Guide to CSS Grid*, CSS-Tricks, viewed 6 October 2025, <https://css-tricks.com/snippets/css/complete-guide-grid/>.

DeGuzman, K 2022, *Getting Started with Axios*, Medium, Bits and Pieces, viewed 6 October 2025, <https://blog.bitsrc.io/the-beginners-guide-to-get-started-with-axios-85a5e8caa2dd>.

Dodds, KC 2024, *How to type a React form onSubmit handler*, Epic React, viewed 6 October 2025, <https://www.epicreact.dev/how-to-type-a-react-form-on-submit-handler>.

freeCodeCamp 2023, *How to Build React Forms with Formik*, freeCodeCamp.org, viewed 6 October 2025, <https://www.freecodecamp.org/news/build-react-forms-with-formik-library/>.

GeeksforGeeks 2021, *How to fetch data from APIs using Asynchronous await in ReactJS?*, GeeksforGeeks, viewed 6 October 2025, <https://www.geeksforgeeks.org/reactjs/how-to-fetch-data-from-apis-using-asynchronous-await-in-reactjs/>.

Google Fonts 2023, *Inter*, Google Fonts, viewed 6 October 2025, <https://fonts.google.com/specimen/Inter>.

MDN Web Docs 2023, *CSS Animations*, MDN Web Docs, viewed 6 October 2025, <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations>.

MDN Web Docs 2023, *CSS Transitions*, MDN Web Docs, viewed 6 October 2025, <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions>.

MDN Web Docs 2023, *Using CSS gradients*, MDN Web Docs, viewed 6 October 2025, <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients>.

Proper 2018, *Stack Overflow*, Stack Overflow, viewed 6 October 2025, <https://stackoverflow.com/questions/50046841/proper-way-to-make-api-fetch-post-with-async-await>.

React Documentation 2023, *Styling and CSS*, React, viewed 6 October 2025, <https://react.dev/learn/styling>.

Tailwind CSS 2023, *Utility-First Fundamentals*, Tailwind CSS, viewed 6 October 2025, <https://tailwindcss.com/docs/utility-first>.

*useState – React* 2025, React.dev, viewed 6 October 2025, <https://react.dev/reference/react/useState>.

W3Schools 2023, *CSS Box Shadow*, W3Schools, viewed 6 October 2025, <https://www.w3schools.com/css/css3_shadows_box.asp>.

W3Schools 2023, *How To Create a Glassmorphism Effect*, W3Schools, viewed 6 October 2025, <https://www.w3schools.com/howto/howto_css_glowing_text.asp>.

