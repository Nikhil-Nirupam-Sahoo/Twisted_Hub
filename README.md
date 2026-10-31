# Anonymous Campus Issue Tracker

A full-stack web app where students can report campus problems without an account, upvote the
issues that matter, and follow them from **Open** → **In Progress** → **Resolved**. Admins sign in
with Firebase email/password auth and update statuses from a live dashboard.

Built with **React + Vite + Tailwind CSS** and **Firebase Firestore, Auth and Hosting**.

---

## Features

- **Anonymous report form** — category, location, and description, saved straight to Firestore.
  No login, no names, no emails.
- **Public issue board** — sorted by upvotes (or newest), filterable by category and status, with
  live updates via Firestore `onSnapshot`.
- **Upvote button** — one vote per browser, remembered in `localStorage`; counts update in real time
  and are safe against lost updates thanks to Firestore `increment()`.
- **Status badges** — Open, In Progress, Resolved, colour-coded everywhere.
- **Admin dashboard** — Firebase email/password login, protected route, status dropdown per issue,
  optimistic UI, live stats, and instant publishing to the public board.
- **Demo mode** — runs immediately with realistic sample data if Firebase is not configured yet.
- **Responsive, accessible UI** — mobile navigation, keyboard focus states, labelled controls, and
  WCAG-friendly contrast.

---

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). Because `.env` has no Firebase keys yet, the
app starts in **demo mode**: issues are stored in your browser's `localStorage`, and you can sign in
to the admin dashboard with:

| Email             | Password   |
| ----------------- | ---------- |
| `admin@campus.edu` | `admin123` |

Demo data is seeded with nine realistic campus issues. To reset it, open DevTools → Application →
Local Storage and delete the keys starting with `campus-`.

> Demo mode is a convenience for exploring the UI. Connect Firebase to get real persistence,
> authentication and multi-user live updates.

---

## Connect Firebase

### 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> and create a project (Google Analytics optional).
2. In the project, go to **Build → Firestore Database** and click **Create database**. Choose
   **Native mode** and a region close to your campus.
3. Go to **Build → Authentication → Get started**, open the **Sign-in method** tab, and enable
   **Email/Password**.
4. Open **Authentication → Users → Add user** and create your admin account (for example
   `admin@yourcollege.edu` with a strong password). There is intentionally no public sign-up form;
   every account you create this way can administer issues.

### 2. Add a web app and copy the config

1. **Project settings → General → Your apps → Add app → Web**.
2. Register the app, then copy the `firebaseConfig` values into `.env`:

```dotenv
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_USE_EMULATORS=false
```

3. Restart the dev server (`Ctrl+C`, then `npm run dev`). The demo banner disappears and the app is
   now using Firestore and Firebase Auth.

> The Firebase web config is not a secret — it is safe in a client bundle. Data is protected by the
> Firestore rules below, not by hiding the keys.

### 3. Deploy Firestore rules

The app ships with production-ready rules in [`firestore.rules`](./firestore.rules). Install the
Firebase CLI and deploy them:

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pick your project and create the "default" alias

npm run build
firebase deploy --only firestore:rules
```

You can also paste the contents of `firestore.rules` into **Firestore → Rules** in the console and
click **Publish**. Until the rules are deployed, Firestore's default test rules may block reads or
allow unsafe writes.

### 4. Add the issue collection

Nothing to create manually! Firestore creates the `issues` collection on the first report. To seed
some content, use the app's report form.

### 5. Deploy to Firebase Hosting

The first time only, initialise Hosting in the console or with the CLI and keep the existing
`firebase.json`:

```bash
firebase init hosting
# - use an existing project
# - public directory: dist
# - single-page app rewrite: Yes
# - do not overwrite firebase.json or index.html
```

Then deploy:

```bash
npm run deploy
```

This builds the Vite app and deploys Hosting (plus Firestore rules). The hosting config already has
the SPA rewrite (`/** → /index.html`), long-lived caching for hashed assets, and `robots.txt`.

---

## Emulator suite (optional)

Use the Firebase emulators to develop without touching production data:

```bash
firebase login
npm run emulators      # Auth :9099, Firestore :8080, UI :4000, Hosting :5000
```

In a second terminal, set `VITE_USE_EMULATORS=true` in `.env` and run `npm run dev`. The app then
connects to the local Auth and Firestore emulators. Create the demo admin in the emulator UI
(<http://localhost:4000>) or with a one-off script, and report an issue through the UI to create the
collection. Rules in `firestore.rules` are applied by the emulator automatically.

> The Firestore emulator requires Java 11+ on your machine.

---

## How it works

### Data model

`issues/{issueId}`:

| Field         | Type      | Notes                                                    |
| ------------- | --------- | -------------------------------------------------------- |
| `category`    | string    | One of the nine values in `src/lib/constants.js`          |
| `location`    | string    | 3–120 characters                                         |
| `description` | string    | 10–1000 characters                                       |
| `status`      | string    | `open`, `in_progress`, or `resolved`                     |
| `upvotes`     | number    | Starts at 0; public updates may only add exactly 1       |
| `createdAt`   | timestamp | `serverTimestamp()`                                      |

### Firestore security rules

- Anyone may **read** issues.
- Anyone may **create** an issue, but only with a valid category, valid lengths, `status: "open"`,
  `upvotes: 0`, and a server timestamp.
- Anyone may **increment upvotes by exactly 1** and may not touch any other field.
- Any **signed-in user** may change **only** the `status` field to a valid value. Create admin
  accounts in the Firebase console — there is no registration screen.
- Deletes are disabled; descriptions and vote counts cannot be rewritten.

### Upvote deduplication

`useVotes` stores the IDs of issues this browser has upvoted in `localStorage`
(`campus-upvoted-issues-v1`) and listens for cross-tab changes. The button becomes disabled after a
successful vote. Clearing storage, using a private window, or switching browsers allows another
vote — that is the trade-off of a login-free upvote.

For stricter one-person-one-vote enforcement you would need identifiable users (Firebase Anonymous
Auth or a phone/email check) plus a Cloud Function / transaction that records a vote document per
issue per user. See `firestore.rules` comments.

### Project structure

```
.
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── EmptyState.jsx
│   │   ├── Filters.jsx
│   │   ├── Footer.jsx
│   │   ├── IssueCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── PageLoader.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── StatusBadge.jsx
│   ├── context/
│   │   └── AuthContext.jsx        # Firebase Auth + demo session
│   ├── hooks/
│   │   └── useVotes.js            # localStorage vote guard
│   ├── lib/
│   │   ├── auth.js                # friendly auth errors, demo creds
│   │   ├── constants.js           # categories, statuses, colours
│   │   ├── demoStore.js           # localStorage fallback backend
│   │   ├── firebase.js            # Firebase initialisation / demo detection
│   │   ├── issues.js              # Firestore reads, creates, upvotes, updates
│   │   └── utils.js
│   ├── pages/
│   │   ├── AdminPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── ReportPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .firebaserc
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
├── package.json
└── vite.config.js
```

### Routes

| Route     | Purpose                                                |
| --------- | ------------------------------------------------------ |
| `/`       | Public issue board with filters, search, and upvotes    |
| `/report` | Anonymous report form                                  |
| `/login`  | Admin email/password sign-in                           |
| `/admin`  | Protected dashboard (redirects to `/login` when signed out) |

---

## Scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Start the Vite dev server                        |
| `npm run build`       | Production build into `dist/`                    |
| `npm run preview`     | Preview the production build locally             |
| `npm run emulators`   | Start Firebase Auth / Firestore / Hosting emulators |
| `npm run deploy`      | Build and deploy Hosting + Firestore rules       |

---

## Troubleshooting

| Symptom                                                     | Fix                                                                                                                         |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Amber “Demo mode” banner won't go away                      | All of `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID` and `VITE_FIREBASE_APP_ID` must be set. Restart Vite after editing `.env`. |
| `Missing or insufficient permissions`                       | Deploy `firestore.rules` (console → Firestore → Rules → Publish, or `firebase deploy --only firestore:rules`).                |
| Admin login says “Incorrect email or password”               | Create the user under Authentication → Users and make sure Email/Password is enabled. This app has no sign-up form.          |
| `auth/unauthorized-domain`                                  | Add your Hosting/localhost domain under Authentication → Settings → Authorized domains.                                      |
| Reports appear on one device but not another                | You are in demo mode (localStorage). Connect Firebase for shared data.                                                        |
| Emulator connection refused                                 | Start `npm run emulators` first and set `VITE_USE_EMULATORS=true`, then restart the dev server.                               |

---

## Production hardening ideas

- Enable **Firebase App Check** (reCAPTCHA Enterprise for web) to reduce automated report spam and
  vote abuse.
- Add a Cloud Function with per-user/IP rate limits if upvotes must be strictly one-per-person.
- Turn on Firestore backups and budget alerts.
- Add a moderation flow (hide/flag) if reports need pre-publication review.
- Add unit/e2e tests around the form validation and admin flows.

---

Built for campuses that need a simple, anonymous feedback loop.
