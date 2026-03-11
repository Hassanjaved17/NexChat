# 💬 NexChat — Real-Time Chat Application

A full-stack real-time chat app built with React and Firebase Realtime Database. Create or join rooms, chat instantly, and see who's online — all in real time.

🔗 **Live Demo:** [Coming Soon]

---

## ✨ Features

- 🔐 **Authentication** — Email/Password + Google Sign-In via Firebase Auth
- 🌍 **Global Room** — Public room anyone can join instantly
- 🏠 **Private Rooms** — Create rooms, share code, only invited users can join
- ⚡ **Real-Time Messaging** — Messages appear instantly using Firebase Realtime DB
- 🟢 **Online Presence** — See who's active in each room live
- 🔴 **Unread Badges** — Per-room unread message count in sidebar
- 🗑️ **Delete Messages** — Users can delete their own messages only
- 📋 **Copy Room Code** — One click to copy and share private room code
- 👤 **User Avatars** — Unique color per user based on their name
- 📱 **Fully Responsive** — Mobile sidebar with smooth slide animation

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React + Vite | Frontend framework |
| Tailwind CSS | Styling |
| Firebase Auth | Authentication |
| Firebase Realtime Database | Real-time messaging + presence |
| React Router DOM | Client-side routing |
| Lucide React | UI icons |
| React Icons | Brand icons (Google) |
| Vercel | Deployment |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── Sidebar.jsx
│   │   ├── ChatWindow.jsx
│   │   └── MessageBubble.jsx
│   └── ui/
│       └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── firebase/
│   └── firebase.js
├── hooks/
│   ├── useMessages.js
│   ├── useRooms.js
│   ├── usePresence.js
│   └── useUnread.js
└── pages/
    ├── LoginPage.jsx
    ├── ChatPage.jsx
    └── NotFound.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Firebase project with Realtime Database + Authentication enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/Hassanjaved17/nexchat.git
cd nexchat

# Install dependencies
npm install

# Create .env file and add your Firebase config
npm run dev
```

### Environment Variables

```
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
VITE_DATABASE_URL=your_realtime_database_url
```

### Firebase Realtime Database Rules

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

---

## 🗺️ Roadmap

- [ ] Typing indicators
- [ ] Message reactions
- [ ] Image sharing
- [ ] User profile editing

---

## 👨‍💻 Author

**Hassan Javed**
- GitHub: [@Hassanjaved17](https://github.com/Hassanjaved17)
- LinkedIn: [Hassan Javed](https://www.linkedin.com/in/hassanjaveds/)

---

## 📄 License

© 2026 Hassan Javed — All Rights Reserved
