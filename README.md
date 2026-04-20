# 📓 JOCTRACKOR
> *A professional-grade, artistic career trajectory ledger.*

my ve
---

## ✨ Key Features

- **🔐 Secure Authentication**: Integrated Google-based login via Firebase Auth with protected routing.
- **📜 Professional Ledger**: A distinctive "Virtual Stationery" UI for logging applications, status changes, and follow-ups.
- **📊 Behavioral Insights**: Quantitative analysis of application success rates using Recharts, helping you understand your "Application Velocity."
- **⚡ Real-time Synchronization**: Powered by Cloud Firestore for instant data persistence across all devices.
- **🖋️ Artistic Aesthetic**: Built with a sleek dark-on-light theme, utilizing *Libre Baskerville* and *Inter* typography for a premium feel.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Visualization**: [Recharts](https://recharts.org/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Firebase Configuration
The project uses a central Firebase configuration. You can find the setup in `src/lib/firebase.ts`. Ensure your Firebase project has:
- **Google Authentication** enabled.
- **Cloud Firestore** initialized.

### 4. Run Locally
Start the development server:
```bash
npm run dev
```

---

## 🏗️ Architecture Notes

- **Smart Sorting**: To ensure maximum performance and avoid complex database indexing, the application handles data sorting locally within the [jobService](file:///Users/asad/Downloads/jobtracker/src/services/db.ts).
- **Protected Layout**: A specialized [Layout](file:///Users/asad/Downloads/jobtracker/src/components/layout/Layout.tsx) component manages the "Index" aesthetic and verified user status.

---

