<div align="center">

# Nelotsavam

Sustainable, gamified farming companion app for Kerala farmers.

Built with Expo, React Native, and Expo Router.

</div>

---

## 🪷 Overview

Nelotsavam is a bilingual (Malayalam & English) farming assistant designed for Kerala farmers. It combines:

- Personalized onboarding and farm profile setup
- Crop selection tailored to Kerala crops
- Gamified sustainability **missions** with points and badges
- Community **forum** for farmer discussions
- **Leaderboard** to compare sustainable farming progress
- Built‑in **audio support** (text‑to‑speech in Malayalam) for better accessibility

The app is built with a single Expo + React Native codebase and also targets the web.

---

## ✨ Features

- **Onboarding flow**
	- Animated intro explaining Nelotsavam and sustainable farming
	- Guides users to create a profile and set up their farm

- **Profile creation**
	- Collects name, district (Kerala‑specific), and farm size (acres)
	- Shows mock **soil information** (type, NPK, water content, pH) for typical Kerala laterite soil
	- Audio guidance in Malayalam for validation and confirmations

- **Crop selection**
	- Choose crops from a curated list (Coconut, Rubber, Paddy, Tea, Coffee, Spices, etc.)
	- Malayalam and English names + descriptions
	- Voice prompt in Malayalam to help the user select crops

- **Dashboard (Home tab)**
	- Animated **score** and progress bar (0–1000 points)
	- Quick stats: completed missions, badges, selected crops
	- Quick actions to jump to Missions, Profile, Leaderboard, and Forum
	- **Welcome audio** in Malayalam announcing the farmer’s name and score

- **Missions**
	- Category‑based missions: General, Paddy, Coconut, Rubber, Tea, Coffee, Spices
	- Each mission has difficulty, points, estimated duration, and descriptions in both languages
	- Accept and complete missions; completion awards points
	- Malayalam voice announcements when missions are accepted or completed

- **Leaderboard**
	- Mock leaderboard data for demo purposes
	- Filter by district or by crop
	- Shows user rank, score, crops, badges, and district
	- Audio summary of top three farmers in Malayalam

- **Community forum**
	- Category filters (General, Coconut, Paddy, Rubber, Tea, Coffee, Spices)
	- Create new posts (title + content) and see replies and likes
	- Simple roles (e.g., Member/Mentor) based on score
	- Malayalam audio feedback when a new post is created

- **Language & accessibility**
	- Global **Language selector** (English / Malayalam)
	- Copy and UI texts managed through a translation system
	- **Text‑to‑speech** via `expo-speech` for many core flows

---

## 🧱 Tech Stack

- **Framework:** Expo (SDK 54), React Native, React Native Web
- **Navigation:** Expo Router, React Navigation (stack + tabs)
- **Styling:** React Native styles + `react-native-css-interop`
- **State & Context:** Custom `AppContext` with React Context API
- **Voice & Accessibility:** `expo-speech` via a `voiceService` wrapper
- **Device APIs & Expo libs:**
	- `expo-av`, `expo-image-picker`, `expo-linear-gradient`, `expo-location`, `expo-network`, `expo-web-browser`, etc.
- **Build / Tooling:**
	- TypeScript
	- ESLint (with Expo + TypeScript configs)
	- Expo EAS config for builds
	- Workbox for web PWA service worker

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js and npm (or yarn) installed
- Expo CLI (optional but recommended):

```bash
npm install -g expo-cli
```

### 2. Install dependencies

From the project root:

```bash
npm install
```

### 3. Run the app (development)

Start the Expo dev server (tunnel mode by default):

```bash
npm run dev
```

Platform‑specific shortcuts:

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

Expo Dev Tools will provide QR codes and simulators/emulators options.

> Note: Some native features (e.g., text‑to‑speech) may behave differently or be limited on the web.

---

## 📦 Build Scripts

Configured in `package.json`:

- `npm run dev` – Start Expo dev server with tunnel
- `npm run android` – Start in Android mode
- `npm run ios` – Start in iOS mode
- `npm run web` – Start in web mode
- `npm run build:web` – Export static web build and generate a Workbox service worker
- `npm run build:android` – Run `expo prebuild -p android` to prepare native Android project
- `npm run lint` – Run ESLint over the codebase

Additional build and EAS options are configured in `eas.json` and `app.json`.

---

## 🗂 Project Structure

High‑level structure:

- `app/`
	- `_layout.tsx` – Root navigation layout (stack), theme, providers
	- `index.tsx` – Splash screen with app logo and initial routing logic
	- `onboarding.tsx` – Onboarding flow
	- `profile-creation.tsx` – Farmer profile creation screen
	- `crop-selection.tsx` – Crop selection screen
	- `(tabs)/` – Main tabbed interface
		- `index.tsx` – Dashboard / Home
		- `missions.tsx` – Missions list and management
		- `leaderboard.tsx` – Leaderboard UI
		- `forum.tsx` – Community forum
		- `profile.tsx` – Profile / progress tab

- `components/`
	- Reusable UI components such as `button`, `BodyScrollView`, `LanguageSelector`, icons, list items

- `contexts/`
	- `AppContext.tsx` – Global app state (user, missions, language, etc.)
	- `WidgetContext.tsx` – Any widget‑specific state

- `data/`
	- `mockData.ts` – Mock missions, badges, soil data, leaderboard, and forum posts
	- `translations.ts` – Translation key/value data

- `services/`
	- `voiceService.ts` – Centralized text‑to‑speech and voice‑related helpers

- `styles/`
	- `commonStyles.ts` – Shared typography, layout, and color utilities
	- `constants/Colors.ts` – Color palette for the app

- `utils/`
	- `translations.ts` – Helper functions to resolve translations (`t`)
	- `errorLogger.ts` – Basic error logging helper

- `types/`
	- Shared TypeScript types for user, missions, badges, crops, forum posts, etc.

---

## 🌐 Internationalization (i18n)

- All user‑facing strings are defined in `data/translations.ts`.
- The helper `t(key, language)` in `utils/translations.ts` resolves the correct text.
- `LanguageSelector` allows switching between:
	- `en` – English
	- `ml` – Malayalam

When a language is changed, the app updates context and shows a confirmation alert in the selected language.

---

## 🔊 Voice & Accessibility

Voice features are handled by `voiceService` (in `services/voiceService.ts`) using `expo-speech`:

- Welcome announcements on the dashboard
- Mission accepted / completed announcements
- Soil data read‑outs after profile creation
- Prompts during onboarding, crop selection, and forum interactions
- Basic (mock) voice command recognition mapping Malayalam/English phrases to actions

These features are especially targeted at improving accessibility for farmers who prefer listening over reading.

---

## 🧪 Linting & Code Quality

- ESLint is configured with Expo and TypeScript rules.
- Run:

```bash
npm run lint
```

to check for style and code issues.

---

## 📝 Notes & Limitations

- Many data sources (missions, soil data, leaderboard, forum posts) use **mock data** for demonstration.
- Voice command recognition is a **simplified** local mapping; production‑level STT would require integration with a real service (e.g., Google Speech‑to‑Text).
- Some features may require running on a real device or simulator with proper TTS voices installed.

---

## 📄 License

This project is intended as a demo / prototype. Add your preferred license here (for example, MIT) before publishing to a public GitHub repository.

