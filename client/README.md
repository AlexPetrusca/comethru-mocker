# Comethru Mocker Client

React Native client application for the Comethru Mocker SMS testing service. Targets desktop (web) platforms.

## Tech Stack

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Platform:** Web (Desktop)

## Prerequisites

- Node.js 18+
- npm or yarn
- Comethru Mocker server running on `http://localhost:8090`

## Getting Started

### Install dependencies

```bash
npm install
```

### Run on Desktop (Web)

```bash
npm run desktop
```

Or for development mode with hot reload:

```bash
npm run web
```

## Project Structure

```
client/
├── app/                      # Expo Router app directory
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── _layout.tsx      # Tab layout configuration
│   │   ├── index.tsx        # Phone Simulator screen
│   │   └── two.tsx          # Settings screen
│   └── _layout.tsx          # Root layout
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MessageBubble.tsx
│   │   ├── PhoneDisplay.tsx
│   │   └── index.ts
│   ├── screens/             # Screen components
│   │   ├── PhoneSimulatorScreen.tsx
│   │   └── index.ts
│   ├── services/            # API services
│   │   ├── api.ts           # Axios instance
│   │   ├── messages.ts      # Messages API
│   │   └── verification.ts  # Verification API
│   └── types/               # TypeScript types
│       └── index.ts
└── package.json
```

## Features

### Phone Simulator

- Set your phone number
- Send SMS messages to other numbers
- View received messages
- Request verification codes
- Verify codes

### Settings

- Configure API URL
- Set default phone number

## API Configuration

By default, the client connects to `http://localhost:8090`. To change this:

1. Navigate to the Settings tab
2. Enter the new API URL
3. Click "Save API URL"

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start Expo development server |
| `npm run web` | Run on web browser (development) |
| `npm run desktop` | Run on web browser (production build) |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |

## Multiple Phone Simulation

To simulate multiple phones:

1. Open multiple browser windows/tabs
2. Each instance can use a different phone number
3. Send messages between instances using the Phone Simulator

## Future Enhancements

- [ ] Real-time message updates (WebSocket/polling)
- [ ] Message delivery status
- [ ] Conversation view
- [ ] Dark mode support
- [ ] Native macOS app support
