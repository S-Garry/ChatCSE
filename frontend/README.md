# Secure Chat Application

A modern, secure chat application built with Next.js featuring end-to-end encryption, real-time messaging, and multi-factor authentication.

## 🌟 Features

- **🔐 End-to-End Encryption**: Messages are encrypted using AES encryption with RSA key exchange
- **🔑 Multi-Factor Authentication**: Two-factor authentication with OTP verification
- **💬 Real-time Chat**: Live messaging with automatic updates using long polling
- **🏠 Channel Management**: Create private channels with invite codes
- **👥 User Management**: View channel members and user information
- **📱 Responsive Design**: Modern UI with Tailwind CSS
- **🛡️ Secure Storage**: No sensitive data stored in browser localStorage

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Database**: Prisma ORM
- **Authentication**: Custom JWT with OTP verification
- **Encryption**: Web Crypto API for RSA/AES encryption
- **UI Components**: Custom components with react-hot-toast

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Database (PostgreSQL/MySQL/SQLite)
- SMTP server for OTP emails

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="your-database-connection-string"
   SMTP_HOST="your-smtp-server"
   SMTP_PORT=587
   SMTP_USER="your-email@domain.com"
   SMTP_PASS="your-email-password"
   JWT_SECRET="your-jwt-secret-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   # or for migrations
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── channels/        # Channel management
│   │   │   ├── invite/          # Invite system
│   │   │   ├── login/           # Authentication
│   │   │   ├── register/        # User registration
│   │   │   └── verify-otp/      # OTP verification
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── chat/                # Chat interface
│   │   └── globals.css
│   ├── components/              # Reusable components
│   ├── lib/                     # Utility functions
│   ├── types/                   # TypeScript definitions
│   └── hooks/                   # Custom React hooks
└── public/                      # Static assets
```

## 🔐 Security Features

### End-to-End Encryption
- **RSA Key Exchange**: Each user generates RSA key pairs for secure key exchange
- **AES Encryption**: Messages are encrypted with AES-256-GCM
- **Unique Keys**: Each message uses a unique AES key
- **No Plain Text Storage**: Only encrypted content is stored in the database

### Authentication
- **Two-Factor Authentication**: OTP verification via email
- **JWT Tokens**: Secure session management
- **Password Hashing**: Bcrypt for password security
- **Session Validation**: Server-side token verification

## 📱 Usage

### Getting Started
1. **Register**: Create an account with email verification
2. **Login**: Sign in with username/password + OTP
3. **Create Channel**: Start a new private chat room
4. **Invite Users**: Share invite codes with other users
5. **Chat Securely**: Send encrypted messages in real-time

### Channel Management
- Create private channels with unique invite codes
- View channel members and online status
- Real-time user list updates
- Channel-specific encryption keys

### Messaging
- Send encrypted messages instantly
- Automatic message decryption for authorized users
- Message history with timestamps
- Real-time message updates via long polling

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/verify-otp` - OTP verification

### Channels
- `GET /api/channels` - List all public channels
- `POST /api/channels` - Create new channel
- `GET /api/channels/[id]/members` - Get channel members
- `GET /api/channels/[id]/messages` - Get channel messages
- `POST /api/channels/[id]/messages` - Send message

### Invites
- `POST /api/invite/[code]` - Join channel via invite code

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom CSS modules. Main color scheme:
- Primary: `#fdf8e6` (light cream)
- Secondary: `#fff6d6` (cream)
- Accent: `#e9d57f` (gold)

### Components
All components are modular and reusable. Key components include:
- `ChatList` - Channel navigation
- `ChatMessages` - Message display with encryption/decryption
- `ChatInfo` - Channel and user information
- `ToastMessage` - Notification system

## 🔒 Privacy & Security

- **No Data Mining**: Messages are end-to-end encrypted
- **Minimal Data Storage**: Only necessary user data is stored
- **Secure Key Management**: Encryption keys are never stored in plain text
- **Session Security**: JWT tokens with expiration
- **Input Validation**: All user inputs are validated and sanitized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify your `DATABASE_URL` in `.env.local`
- Ensure your database server is running
- Run `npx prisma db push` to sync schema

**OTP Not Received**
- Check SMTP configuration in `.env.local`
- Verify email server settings
- Check spam/junk folders

**Encryption Errors**
- Clear browser cache and localStorage
- Regenerate user key pairs
- Verify Web Crypto API support

### Support
For issues and questions, please open an issue on the GitHub repository.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Manual Deployment
1. Build the application: `npm run build`
2. Set up your database and environment variables
3. Deploy to your preferred hosting platform

---

Built with ❤️ using Next.js and modern web technologies.