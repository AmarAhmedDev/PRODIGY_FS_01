# Authentication System - Prodigy InfoTech Task 01

## 📝 Overview
This is a robust and responsive Authentication System built using React, Vite, and Firebase. It features a modern user interface with a smooth sliding panel animation to seamlessly toggle between Sign Up and Sign In forms. This project serves as Task 01 for the Prodigy InfoTech Full Stack Development internship.

## 🌟 Features
- **User Registration**: Sign up with Full Name, Email, Password, and Phone Number.
- **User Authentication**: Secure login using Firebase Authentication.
- **Google Sign-In**: Quick authentication using Google accounts via popup.
- **Password Recovery**: Integrated "Forgot Password" functionality sending reset emails via Firebase.
- **Form Validation**: Comprehensive client-side validation for emails, passwords, and custom rules for names and phone numbers.
- **Interactive UI**: Engaging sliding animation to switch between login and registration panels seamlessly.
- **Protected Route/Dashboard**: Authenticated users are redirected to a secure welcome dashboard displaying their details and join date.

## 🛠️ Technologies Used
- **Frontend Core**: React (v19), Vite
- **Styling**: Vanilla CSS, FontAwesome Icons (`@fortawesome/fontawesome-free`)
- **Backend/Auth**: Firebase Authentication (Email/Password & Google Provider)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AmarAhmedDev/PRODIGY_FS_01.git
   ```

2. Navigate into the project directory:
   ```bash
   cd PRODIGY_FS_01
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## ⚙️ Firebase Configuration
This project uses Firebase for authentication. To run it with your own Firebase instance:
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Go to **Authentication** and enable **Email/Password** and **Google** sign-in methods.
3. Register a web app in your Firebase project to get the configuration object.
4. Update the configuration in `src/firebase.js` with your own credentials.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📜 License
This project is open-source and available under the MIT License.
