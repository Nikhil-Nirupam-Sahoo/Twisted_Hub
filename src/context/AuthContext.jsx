import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { DEMO_ADMIN } from '../lib/auth'
import { sleep } from '../lib/utils'

const DEMO_SESSION_KEY = 'campus-demo-admin-session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      try {
        const raw = localStorage.getItem(DEMO_SESSION_KEY)
        if (raw) setUser(JSON.parse(raw))
      } catch {
        // Ignore unavailable/invalid localStorage.
      }
      setLoading(false)
      return undefined
    }

    return onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(
          firebaseUser
            ? {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
              }
            : null,
        )
        setLoading(false)
      },
      (error) => {
        console.error('[auth] state listener failed', error)
        setLoading(false)
      },
    )
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (!isFirebaseConfigured) {
      await sleep(500)
      const normalized = email.trim().toLowerCase()
      if (normalized === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        const demoUser = {
          uid: 'demo-admin',
          email: DEMO_ADMIN.email,
          displayName: 'Campus Admin',
        }
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
        setUser(demoUser)
        return demoUser
      }
      const error = new Error('Incorrect email or password. Use the demo credentials shown below.')
      error.code = 'auth/invalid-credential'
      throw error
    }

    const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
    return credential.user
  }, [])

  const signOut = useCallback(async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem(DEMO_SESSION_KEY)
      setUser(null)
      return
    }
    await firebaseSignOut(auth)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signOut, isAdmin: Boolean(user) }),
    [user, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}
