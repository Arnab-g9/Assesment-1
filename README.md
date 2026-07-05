# House of Edtech Assessment - JioHotstar Clone

A robust, production-ready React Native application built with **Expo Router** and **NativeWind (Tailwind CSS)**. This project meticulously replicates the core user experience, dynamic UI, and performance optimizations of the JioHotstar mobile application.

## 🚀 Technical Architecture & Design Choices

### Core Framework
- **React Native & Expo (SDK 57)**: Chosen for rapid development, reliable over-the-air updates, and world-class developer experience.
- **Expo Router**: Utilized for its modern, file-based routing architecture. It enables seamless deep linking, native stack navigation, and clean layout hierarchies (`_layout.tsx`) similar to Next.js.

### UI & Styling
- **NativeWind (Tailwind CSS v4)**: Replaces cumbersome StyleSheet objects with utility-first CSS classes. This accelerates UI development, drastically reduces code bloat, and provides a powerful, dynamic Theme Engine capable of switching between Light and Dark modes instantly.
- **Lucide Icons**: Used for crisp, scalable, and modern vector iconography.

### State & Data Layer
- **Mock Service Layer**: An asynchronous `MockApi` service resolves JSON mock data to simulate real-world network fetching (complete with artificial delays). This ensures the UI is strictly data-driven and completely decoupled from hardcoded strings.
- **Async Storage / MMKV**: Upgraded the local storage engine from `AsyncStorage` to the blazing-fast `react-native-mmkv` (via Nitro Modules) to persist user theme preferences instantly with zero asynchronous bridge overhead.

### Performance Optimizations
- **List Rendering**: Utilized `FlatList` heavily with memoized `renderItem` functions (`useCallback`), optimized `keyExtractor`s, and strict configurations (`initialNumToRender`, `windowSize`, `getItemLayout`) to ensure buttery smooth 60fps scrolling on massive lists.
- **Memoization**: Implemented `React.memo` and `useMemo` strategically across deeply nested components (like `ContentRow`) to prevent unnecessary re-renders.
- **Image Caching**: Integrated `expo-image` with `memory-disk` caching policies to ensure hero banners and movie posters load instantly without network stutter.

### Micro-Interactions
- **React Native Reanimated**: Added fluid, physics-based animations to enhance UX. This includes a spring-bounce scale effect on the bottom Tab Bar icons and a staggered slide-up entrance animation for the Floating Menu.

### Testing Infrastructure
- **Jest & React Native Testing Library**: Set up a comprehensive unit testing suite to validate data extraction, search filtering logic, pagination limits, and simulated network crashes.

---

## 🛠️ Step-by-Step Setup Instructions

Because this project utilizes high-performance C++ native modules (like `react-native-mmkv` and `react-native-nitro-modules`), it requires a **Development Build** rather than the standard Expo Go app. 

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Xcode** (for iOS simulator) OR **Android Studio** (for Android emulator)
- **CocoaPods** (for iOS dependencies)

### 2. Install Dependencies
Clone this repository and navigate into the project root, then install the required node modules:

```bash
npm install
```

### 3. Build the Native App
Instead of `npm start`, you must compile the native code to include the MMKV C++ bridge.

**For iOS Simulator:**
```bash
npx expo run:ios
```

**For Android Emulator:**
```bash
npx expo run:android
```

*Note: The first time you run this command, it will take a few minutes to download and compile the native SDKs (e.g., running `pod install` for iOS).*

### 4. Running the App (Subsequent Uses)
Once the native build is installed on your simulator, you can start the Metro bundler normally without rebuilding the native code:

```bash
npx expo start -c
```
*(The `-c` flag clears the cache to ensure a fresh bundle).*

---

## 🧪 Running Tests
To execute the Jest unit and component test suites, simply run:

```bash
npm run test
```
*(Or `npx jest`)*

Enjoy exploring the codebase!
