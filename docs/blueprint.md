# **App Name**: SecureLink ATM

## Core Features:

- Secure User Login UI: Frontend form for entering a 16-digit card number and a 4-digit PIN with real-time client-side validation to ensure numeric input and correct lengths. Submits data securely via POST.
- Backend Authentication API: Next.js API route to receive login credentials, validate the card number and encrypted PIN against a MySQL database, implementing parameterized queries to prevent SQL injection.
- One-Time Password (OTP) Generation: Upon successful card and PIN authentication, a unique 6-digit OTP is generated server-side and temporarily stored, awaiting user verification.
- OTP Verification Flow: Dedicated UI for users to input the generated OTP, with a Next.js API endpoint to verify its correctness and validity within a specific time window.
- Secure Session Management: Establishes a secure, server-side session for the user upon successful OTP verification, enabling access to authenticated areas of the application.
- Account Lockout System: Tracks failed login attempts in the MySQL database, incrementing a counter and locking the user account after 3 consecutive invalid login attempts.
- Protected User Dashboard: A basic, authenticated dashboard page that is only accessible after a user successfully logs in and verifies their identity through OTP.

## Style Guidelines:

- Primary interactive color: A vibrant, trustworthy blue (#5299E0), chosen for its association with security and professionalism. This bright shade stands out against the dark interface, drawing attention to key actions.
- Background color: A deep, muted blue-grey (#21262C) derived from the primary hue but heavily desaturated and darkened to create a sophisticated and secure-feeling dark mode environment.
- Accent color: A soft, luminous lavender-purple (#E1CCFF) serves as an analogous highlight, approximately 30 degrees 'right' from the primary blue on the color wheel. Its bright and high-saturation contrast is used for status indicators, confirmations, and alerts.
- All text will use 'Inter', a grotesque-style sans-serif. Its modern, machined, and neutral aesthetic ensures high legibility and a professional feel, suitable for both headlines and body text within a security-focused application.
- Clean, minimalistic line icons are preferred for clarity and efficiency. Icons related to security (locks, shields, checks), input fields (keypad, card), and user actions (arrows, refresh) will enhance intuitive navigation.
- A focused, centralized layout emphasizes the core verification process. Forms are designed with ample white space for clear input, and responsive principles ensure optimal display on various devices without clutter.
- Subtle, non-distracting micro-interactions, such as input field focus highlights and discrete loading indicators, will provide visual feedback to the user without slowing down the crucial verification steps. Transitions between pages will be smooth and seamless.