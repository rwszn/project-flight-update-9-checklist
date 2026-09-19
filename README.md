# Project Flight Update 9 Checklist

A browser-based flight checklist for Project Flight Update 9.

The website is designed for Roblox flight sessions and provides a clean, simple checklist without trying to replicate real-world airline systems.

## Live Website

https://project-flight-update-9-checklist.vercel.app/

## Features

### Flight Modes

The checklist has three modes:

- Quick Flight
  - Main checklist
  - Less information on screen
  - Notes remain available
  - Advanced Controls can still be opened at any time

- Full Flight
  - Main checklist
  - Flight Information
  - Notes
  - Advanced Controls
  - Full checklist experience

- Practice Flight
  - Separate practice mode
  - Choose exactly which maneuvers to practise
  - Only selected maneuvers are shown
  - Practice flights are kept separate from normal saved flights
  - Maximum of 10 saved practice flights

## Main Checklist

The normal flight checklist covers:

1. Preflight / Flight Setup
2. Startup
3. Pushback
4. Before Taxi
5. Taxi
6. Before Takeoff
7. Takeoff
8. After Takeoff
9. Climb
10. Cruise
11. Descent
12. Approach
13. Final Approach
14. Landing
15. After Landing
16. Taxi to Gate
17. At Gate / Parking
18. Shutdown / Flight Complete

Checklist items can be:

- Completed
- Skipped

Skipping an item still allows the checklist to continue.

The website automatically moves toward the next section when the current section has been completed or skipped.

## Advanced Controls

Advanced Controls are optional and hidden by default.

They can be opened or closed at any time during Quick Flight or Full Flight.

They include additional aircraft control checks such as:

- Throttle
- Pitch
- Roll
- Yaw
- Brakes
- Ground handling
- Control checks

Advanced Controls are not required to finish the main flight checklist.

## Flight Completion Summary

When every main checklist item has been completed or skipped, a flight completion summary is shown.

The summary includes:

- Number of completed items
- Number of skipped items
- Flight duration
- Aircraft
- Flight number
- Notes

The completed flight can then be saved as a Flight Summary.

The completion numbers and duration are calculated automatically rather than using fixed values.

## Practice Flights

Practice Flights are separate from normal flights.

Before starting a practice flight, the user chooses exactly what they want to practise.

### In-Flight Practice Maneuvers

- Steep Turns (30° to 45° Bank Angle)
- Slow Flight Setup & Handling
- Stall Entry & Recovery Practice
- Holding Patterns
- Engine Failure Glide & Trim

### Circuit & Touch-and-Go Practice

- Pattern Entry & Approach
- Touch-and-Go Execution

Each maneuver contains:

- Instructions
- A success check
- A completion control

Practice Flights do not count as completed normal flights.

A maximum of 10 Practice Flights can be stored.

## Saved Flights

Normal flights can be saved and restored later.

Saved flights include the checklist state, flight information and notes.

Maximum saved flights: 30.

Saved flight data is stored locally in the browser.

## Authentication

The website supports:

- Email and password login
- Account creation
- Email verification
- Password reset
- Password recovery
- Guest mode
- Log out

Supabase is used for authentication.

## Data Storage

The project currently uses browser `localStorage` for:

- Checklist progress
- Skipped items
- Advanced Controls
- Flight Information
- Notes
- Saved Flights
- Practice Flights
- Current flight mode

There is currently no database table storing checklist progress.

This means saved checklist data is tied to the browser and device being used.

Authentication is handled separately through Supabase.

## Analytics

Google Analytics 4 is connected to the website to measure website usage and engagement.

Measurement ID:

`G-5NQVYQRH8H`

## Deployment

The project is hosted using:

- GitHub for the source code
- Vercel for deployment
- Supabase for authentication
- Google Analytics for website analytics

GitHub repository:

https://github.com/rwszn/project-flight-update-9-checklist

## Project Files

### `index.html`

Contains the website structure, authentication screens, flight information, checklist layout, dialogs and practice flight interface.

### `style.css`

Contains the complete visual design and responsive layout.

### `script.js`

Contains:

- Checklist logic
- Progress tracking
- Skip functionality
- Section advancement
- Flight modes
- Practice Flights
- Saved Flights
- Flight completion summaries
- Authentication logic
- Local storage
- Notes
- Advanced Controls

### `config.js`

Contains the Supabase project URL and frontend publishable key.

## Design

The website uses a simple aviation-inspired dark interface.

Design rules:

- No purple or blue gradients
- No complicated visual effects
- No badges
- No emojis
- No unnecessary animations
- No excessive rounded cards
- No unnecessary UI elements
- Responsive on desktop and mobile
- Clear buttons and readable checklist items

The main accent colour is a muted aviation gold.

## Important Warning

This checklist is for Project Flight Update 9 and is not suitable for every aircraft. Aircraft controls and available features can vary.

The website is intended for Roblox gameplay and should not be treated as a real-world aviation checklist or operating procedure.

## Development

This is a static browser-based website.

There is no build command required.

The project can be deployed directly through Vercel from the GitHub repository.

Typical update process:

1. Edit the project files.
2. Commit the changes to GitHub.
3. Vercel automatically detects the update.
4. Vercel deploys the new version.
5. The live website updates automatically.

## Copyright

© 2026 Project Flight Update 9. All rights reserved.
