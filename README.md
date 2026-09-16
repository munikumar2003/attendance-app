# Attendance Marking App 📱

An offline-first, mobile-optimized student attendance management application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Designed specifically for teachers and educators to mark attendance in seconds using an interactive calendar-style roll grid, generate Excel spreadsheets, and track attendance reports—all stored **100% locally** on the device without requiring any internet or cloud connection.

---

## ✨ Features

- 📅 **Interactive Calendar-Style Roll Grid**:
  - Tap roll numbers to toggle between Present (Emerald Green) and Absent (Rose Red).
  - Quick 1-tap **Refresh All Present** button in the bottom right corner to instantly set all roll numbers to green.
  - Multi-roll search / direct jump navigation.
  - Real-time Present & Absent counters with visual completion ring.
  
- 📴 **100% Offline & Private**:
  - All data (classes, roll counts, daily attendance records) is stored exclusively in local device storage (`localStorage`).
  - No internet connection, server, or cloud account needed.

- 🏫 **Multiple Classes & Custom Roll Counts**:
  - Add, rename, and manage multiple classes (e.g. Class 10-A, Class 10-B, Science Lab).
  - Customize student strength per class (supports up to 300+ students).

- 📊 **Download Attendance & Excel Export**:
  - Export comprehensive attendance matrices to `.xlsx` (Excel) format.
  - Generates roll-by-date grids with daily 'P' / 'A' markings, total present/absent days, and attendance percentages.
  - In-app interactive attendance logs filterable by date range and class.

- 🚀 **Zero Predefined Data / Fresh Start**:
  - Fresh installations launch directly into a clean "Get Started" screen.
  - Quick setup to configure your classes immediately.

- 📱 **Mobile & PWA Ready**:
  - Touch targets calibrated for easy one-thumb operation.
  - Installable as a Progressive Web App (PWA) on Android / iOS homescreens or wrappable into an Android APK via Bubblewrap / Capacitor for Google Play Store publication.

---

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Export**: XLSX (SheetJS)
- **Animation**: Motion
- **Build Tool**: Vite 6

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn / pnpm / bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/attendance-app.git
   cd attendance-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   The compiled static files will be generated in the `dist/` directory.

---

## 📱 Publishing to Google Play Store

Because this application is 100% client-side and offline, you can package it into an Android app (`.aab` / `.apk`) for the Google Play Store using either of the following standard methods:

### Option 1: Google PWABuilder / Bubblewrap (Recommended & Easiest)
1. Deploy your built `dist/` folder to any static hosting (GitHub Pages, Cloudflare Pages, Vercel, Firebase Hosting) or use a local server.
2. Visit [PWABuilder.com](https://www.pwabuilder.com/).
3. Enter your web app URL.
4. Click **Package for Android** to generate a signed Android App Bundle (`.aab`) ready for Google Play Console upload.

### Option 2: Capacitor (Native Android Studio Project)

A pre-configured `capacitor.config.ts` is already included in this repository.

1. **Install dependencies**:
   ```powershell
   npm install
   ```

2. **Build the production web app**:
   ```powershell
   npm run build
   ```

3. **Add Android platform & sync**:
   ```powershell
   npx @capacitor/cli add android
   npx @capacitor/cli sync
   ```

4. **Open in Android Studio**:
   ```powershell
   npx @capacitor/cli open android
   ```

5. **Generate Signed Bundle (`.aab`)**:
   - In Android Studio, wait for Gradle sync to complete.
   - Go to menu: **Build > Generate Signed Bundle / APK...**
   - Select **Android App Bundle**, create/choose your keystore, and click **Finish**.
   - Your `.aab` file will be generated in `android/app/release/` ready for Google Play Store upload.

> 💡 **Tip for Windows / PowerShell users:**
> - Always run `npm run build` before running `npx @capacitor/cli add android` (Capacitor needs the `dist/` directory to exist).
> - If `npx cap` gives an error on Windows, use `npx @capacitor/cli <command>` directly.

---

## 📄 License

MIT License. Free to use for schools, colleges, and personal education projects.
