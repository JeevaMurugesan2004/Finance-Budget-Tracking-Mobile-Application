# Finance & Budget Tracker Mobile Application (React Native / Expo)

A complete, functional, professional React Native Expo mobile application named **Finance & Budget Tracker**, built strictly following the Figma design reference and all 75-mark assignment requirements.

---

## 📱 Features & Highlights

- **100% Indian Rupees (INR) Everywhere**: Formatted using the `en-IN` locale (`₹`) with Indian number grouping (thousands, lakhs, and crores) via `src/utils/currency.ts`. No dollar symbols or other currencies are used.
- **Role-Based Access Control**:
  - **Admin**: Views aggregated organizational summaries, Home, and Financial Analysis. Customer-only transactional screens (Transactions, Categories, Profile, Edit Profile, Category Details, Add/Edit Transaction) are protected and restricted from Admin navigation.
  - **Customer**: Complete access to all 6 screen groups with full CRUD operations for personal transactions, month/year filtering, category budgets, and profile persistence.
- **All Three Navigation Types Working Seamlessly**:
  - **Stack Navigation**: Native Stack for Authentication (`Welcome`, `SignIn`, `SignUp`), modals, and detail routes (`AddTransaction`, `EditTransaction`, `EditProfile`, `CategoryDetails`).
  - **Bottom Tab Navigation**: Role-tailored tabs (`Home`, `Analysis`, `Transactions`, `Categories`).
  - **Drawer Navigation**: Custom drawer with avatar, user role badge, navigation links, and logout.
- **Live Daily, Weekly, and Monthly Reports**: Dynamic real-time calculation from actual saved transaction dates and amounts. Period toggling immediately updates income, expenses, and net change.
- **Personalized Transaction Alerts**: Dynamic animated in-app notifications and alerts triggered on adding, editing, or deleting transactions (e.g. *"Your ₹500 Food expense was added successfully!"*, budget notices, and warnings).
- **Frontend-Only Local Persistence**: Zero external backend or cloud database dependencies. Fully persisted using `@react-native-async-storage/async-storage` with versioned keys and fallback to realistic Indian demo transactions.
- **Financial Analysis Charts**: Side-by-side Income vs. Expense comparative bar charts, Category Donut distribution charts, and Spending timeline trends powered by SVG.

---

## 🔑 Demo Login Credentials

The application provides quick 1-tap demo credentials buttons on the Sign In screen for instant testing:

| Role | Email Address | Password | Permitted Destinations |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.in` | `admin123` | Home, Financial Analysis, Drawer Navigation |
| **Customer** | `customer@example.in` | `customer123` | Home, Analysis, Month Transactions, Categories, Category Details, Profile, Edit Profile, Add/Edit Transactions |

---

## 🛠️ Technology Stack & Installed Dependencies

- **Framework**: React Native `0.88.0` with Expo SDK `58.0.20`
- **Language**: TypeScript `6.0.3` (Strict type checking, 0 errors)
- **Navigation**:
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/drawer`
- **Native Support**:
  - `react-native-screens`
  - `react-native-safe-area-context`
  - `react-native-gesture-handler`
  - `react-native-reanimated`
- **Data Persistence**:
  - `@react-native-async-storage/async-storage`
- **Icons & Graphics**:
  - `@expo/vector-icons` (Ionicons)
  - `react-native-svg` (SVG financial charts)

---

## 🚀 How to Run the App

### 1. Start the Expo Development Server
```bash
npx expo start
```
or
```bash
npm start
```

### 2. Testing on Android / Expo Go
- **Physical Device**: Download **Expo Go** from Google Play Store on your Android phone. Scan the QR code displayed in the terminal or Expo Dev Tools.
- **Android Emulator**: Press `a` in the terminal to launch the app on an active Android emulator.
- **Web Browser**: Press `w` in the terminal to open the web view for inspection.

---

## 📂 Project Architecture

```
Finance-Budget-Tracking-Application/
├── assets/                       # App icons and adaptive launcher images
├── src/
│   ├── components/
│   │   ├── AppButton.tsx         # Reusable button with variants (primary, outline, danger)
│   │   ├── AppInput.tsx          # Reusable input with icons, password toggle & inline validation
│   │   ├── BalanceCard.tsx       # Emerald gradient card with balance, income and expense in INR
│   │   ├── CategoryCard.tsx      # Category card with icon, spend, % badge and budget progress bar
│   │   ├── EmptyState.tsx        # Informative empty states with icons and call to action
│   │   ├── FinanceCharts.tsx     # SVG Income vs Expense bar, Category donut & Spending trend
│   │   ├── NotificationBanner.tsx# Animated personalized alert banner
│   │   ├── ReportCard.tsx        # Daily, Weekly, Monthly report switcher
│   │   └── TransactionItem.tsx   # Category-badged transaction item with edit/delete actions
│   ├── context/
│   │   ├── AuthContext.tsx       # Demo session, role switching, sign-in/up & profile updating
│   │   └── FinanceContext.tsx    # Live transactions, categories, reports, alerts & AsyncStorage sync
│   ├── data/
│   │   ├── categories.ts         # Categories (Food, Shopping, Transport, Bills, Health, etc.)
│   │   └── sampleTransactions.ts # Realistic Indian demo transactions (Salary ₹35,000, etc.)
│   ├── navigation/
│   │   ├── RootNavigator.tsx     # NavigationContainer wrapper
│   │   ├── StackNavigator.tsx    # Native Stack with role-based screen mounting
│   │   ├── TabNavigator.tsx      # Bottom Tab bar with role-filtered customer/admin destinations
│   │   └── DrawerNavigator.tsx   # Custom Drawer with avatar, role badge, navigation links & logout
│   ├── screens/
│   │   ├── WelcomeScreen.tsx     # Welcome / Onboarding with branding & demo credentials guide
│   │   ├── SignInScreen.tsx      # Sign In with role switcher & 1-tap demo loaders
│   │   ├── SignUpScreen.tsx      # Sign Up with Indian mobile validation & password confirmation
│   │   ├── HomeScreen.tsx        # Home dashboard with greeting, reports, recent txs & quick actions
│   │   ├── AnalysisScreen.tsx    # Analysis dashboard with SVG charts and period filtering
│   │   ├── ProfileScreen.tsx     # Customer Profile with personal details, reset data & logout
│   │   ├── EditProfileScreen.tsx # Edit profile form with Indian phone validation
│   │   ├── TransactionsScreen.tsx# Month & year selector, All/Income/Expense filters & CRUD
│   │   ├── AddTransactionScreen.tsx # Add transaction form with category picker & validation
│   │   ├── EditTransactionScreen.tsx# Edit transaction form with instant recalculation
│   │   ├── CategoriesScreen.tsx  # Overall categories list with spending and budget progress
│   │   └── CategoryDetailsScreen.tsx# Category details, history, monthly budget limit & remaining
│   ├── theme/
│   │   ├── colors.ts             # Curated Figma Emerald Teal (#00A86B) color system
│   │   ├── spacing.ts            # Margins, paddings, border radius and drop shadows
│   │   └── typography.ts         # Consistent font weights, sizes and line heights
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for User, Transaction, Category, Reports
│   └── utils/
│       ├── calculations.ts       # Balance, period report calculations & category breakdown
│       ├── currency.ts           # Mandatory INR formatCurrency utility
│       ├── dateUtils.ts          # Monday-start week calculations, month names & ISO formatting
│       ├── storage.ts            # Versioned AsyncStorage wrapper with error handling
│       └── validation.ts         # Email, Indian mobile number, password & form validation
├── App.tsx                       # GestureHandlerRootView, SafeAreaProvider & Providers
├── index.ts                      # App entry point with react-native-gesture-handler
├── babel.config.js               # Babel configuration with react-native-reanimated plugin
├── app.json                      # Expo application metadata and configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript compiler options
```

---

## 🇮🇳 Currency Rules Adherence

Implemented directly in [src/utils/currency.ts](file:///d:/OneDrive/Desktop/Modal-Exam/PR-Modal-Exam/Finance-Budget-Tracking-Application/src/utils/currency.ts):
```typescript
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
```
Used consistently across all 12 screens, SVG chart labels, summary cards, report toggles, transaction items, category progress badges, and personalized alerts.
