export const DEMO_ADMIN = {
  email: 'admin@campus.edu',
  password: 'admin123',
}

const AUTH_ERROR_MESSAGES = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a minute and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/unauthorized-domain':
    'This domain is not authorized for sign-in. Add it under Authentication → Settings → Authorized domains.',
  'auth/operation-not-allowed':
    'Email/password sign-in is disabled. Enable it in the Firebase console.',
}

export function friendlyAuthError(error) {
  if (!error) return 'Something went wrong. Please try again.'
  return AUTH_ERROR_MESSAGES[error.code] ?? error.message ?? 'Something went wrong. Please try again.'
}
