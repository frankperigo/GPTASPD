# ASPD - Average Shits Per Day

A React Native (Expo) mobile app for tracking bathroom movements with a social check-in experience. Track your visits, understand your patterns, and maintain a healthy routine.

## Tech Stack

- **React Native** with **Expo** (TypeScript)
- **React Navigation** - Bottom tabs + stack navigation
- **Zustand** - State management
- **AsyncStorage** - Local data persistence
- **date-fns** - Date handling

## Setup

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Project Structure

```
src/
  components/       # Reusable UI components
    AchievementBadge.tsx
    BristolScalePicker.tsx
    Button.tsx
    CheckInListItem.tsx
    ConfettiOverlay.tsx
    StarRating.tsx
    StatCard.tsx
    ToiletTypePicker.tsx
  constants/        # Theme, Bristol scale data, achievements
    achievements.ts
    bristolScale.ts
    theme.ts
  navigation/       # Navigation configuration
    AppNavigator.tsx
  screens/          # App screens
    CheckInScreen.tsx
    HomeScreen.tsx
    OnboardingScreen.tsx
    ProfileScreen.tsx
    StatsScreen.tsx
  store/            # Zustand state management
    useStore.ts
  types/            # TypeScript type definitions
    index.ts
  utils/            # Utility functions
    sampleData.ts
    stats.ts
    storage.ts
```

## Features

### Home Dashboard
- Today's visit count with hero display
- 7-day average, current streak, and total stats
- Recent check-ins list with pull-to-refresh
- Time-based greeting

### Check-In Flow
- Toilet type selector (Home, Work, Public, Friend's, Other)
- Bristol Scale visual picker (Types 1-7)
- 5-star experience rating
- Optional location and notes
- Confetti celebration animation on save

### Statistics
- Period selector (7/30/90 days)
- Bar chart for daily visit trends
- Bristol Scale distribution chart
- Stats cards: daily average, peak time, favorite location, longest streak

### Profile & Settings
- Journey summary with averages and streaks
- Achievement badges (5 achievements)
- Data export (JSON via share sheet)
- Clear all data option

### Onboarding
- 3-screen welcome flow
- Pre-populates sample data for testing

## Achievements

| Badge | Name | Requirement |
|-------|------|-------------|
| Party | Getting Started | Log first visit |
| Fire | Consistent | 7-day streak |
| Diamond | Dedicated | 30-day streak |
| Sunrise | Morning Person | 10 check-ins before 9 AM |
| Star | Regular | Average 1+ per day for a week |

## Color Palette

- Primary: `#8B6F47` (Warm brown)
- Secondary: `#A8B89F` (Sage green)
- Background: `#FAF7F2` (Cream)
- Accent: `#87CEEB` (Sky blue)
