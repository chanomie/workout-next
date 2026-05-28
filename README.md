# Workout Next

## Overview
**Workout Next** is a modern, privacy-focused workout timer and exercise companion built with Next.js. It provides a streamlined interface for following structured workout routines, including warm-ups, core exercises, and cool-downs. The application is designed as a Progressive Web App (PWA), ensuring it remains accessible and functional even on the go.

### Key Features
- **Structured Routines:** Seamlessly transition between warm-up, workout, and cool-down phases.
- **Visual Guidance:** Integrated exercise images and timers to keep you on track.
- **Privacy First:** Data is stored locally in your browser; no sign-ups or cloud sync required.
- **PWA Support:** Installable on mobile devices for a native-like experience.

## 🏋️ Workout Structure
Each workout session is dynamically generated to provide a balanced and effective routine:

### 1. Warm-up (2.5 Minutes)
- **Selection:** 5 unique mobility exercises.
- **Timing:** 30 seconds per exercise.

### 2. Core Workout (~22 Minutes)
The core phase is organized into repetitive blocks to build intensity:
- **Block Logic:** Each block consists of 3 or 4 random exercises.
- **Pattern:**
  - **Round 1:** All exercises in the block (30s each).
  - **Rest:** 30 seconds.
  - **Round 2:** Repeat the same exercises (30s each).
- **Transition:** 30-second rest between different blocks.

### 3. Cool-down (2.5 Minutes)
- **Selection:** 5 unique stretching exercises.
- **Timing:** 30 seconds per exercise.

This application is built entirely using **Gemini** through an **agentic development process**, showcasing the power of AI-driven software engineering.

---

## 🚀 Live Demo
You can access the live application here:  
**[https://chanomie.github.io/workout-next/](https://chanomie.github.io/workout-next/)**

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

This project uses [Next.js 16](https://nextjs.org) and [React 19](https://react.dev).

### Built With
- **Framework:** Next.js (App Router)
- **Styling:** CSS Modules & Global CSS
- **PWA:** `@ducanh2912/next-pwa`
- **Deployment:** GitHub Pages
