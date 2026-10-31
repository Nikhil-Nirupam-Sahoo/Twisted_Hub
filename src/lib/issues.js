import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import {
  createDemoIssue,
  subscribeToDemoIssues,
  updateDemoIssueStatus,
  upvoteDemoIssue,
} from './demoStore'

const ISSUES_COLLECTION = 'issues'

function normalizeIssue(document) {
  const data = document.data()
  const createdAt =
    typeof data.createdAt?.toMillis === 'function' ? data.createdAt.toMillis() : Date.now()

  return {
    id: document.id,
    category: data.category ?? 'other',
    location: data.location ?? 'Unknown location',
    description: data.description ?? '',
    status: data.status ?? 'open',
    upvotes: Number(data.upvotes) || 0,
    createdAt,
  }
}

/**
 * Live subscription to all issues, ordered by upvotes (desc).
 * Firestore updates the board in real time; demo mode mirrors that behaviour.
 */
export function subscribeToIssues(onData, onError) {
  if (!isFirebaseConfigured) {
    return subscribeToDemoIssues(onData)
  }

  const issuesQuery = query(collection(db, ISSUES_COLLECTION), orderBy('upvotes', 'desc'))

  return onSnapshot(
    issuesQuery,
    (snapshot) => {
      const issues = snapshot.docs.map(normalizeIssue)
      // Tie-break by recency so equally-upvoted issues have a stable order.
      issues.sort((a, b) => b.upvotes - a.upvotes || b.createdAt - a.createdAt)
      onData(issues)
    },
    (error) => {
      console.error('[issues] subscription failed', error)
      onError?.(error)
    },
  )
}

export async function createIssue({ category, location, description }) {
  if (!isFirebaseConfigured) {
    return createDemoIssue({ category, location, description })
  }

  const document = await addDoc(collection(db, ISSUES_COLLECTION), {
    category,
    location: location.trim(),
    description: description.trim(),
    status: 'open',
    upvotes: 0,
    createdAt: serverTimestamp(),
  })

  return document.id
}

export async function upvoteIssue(issueId) {
  if (!isFirebaseConfigured) {
    return upvoteDemoIssue(issueId)
  }

  // Rules only permit increments of exactly +1, so concurrent votes cannot
  // clobber the counter.
  await updateDoc(doc(db, ISSUES_COLLECTION, issueId), {
    upvotes: increment(1),
  })
}

export async function updateIssueStatus(issueId, status) {
  if (!isFirebaseConfigured) {
    return updateDemoIssueStatus(issueId, status)
  }

  await updateDoc(doc(db, ISSUES_COLLECTION, issueId), { status })
}
