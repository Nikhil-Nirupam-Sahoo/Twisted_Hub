import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'campus-upvoted-issues-v1'

function readVotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

/**
 * Remembers which issues this browser has already upvoted so repeat votes are
 * blocked. Also syncs across tabs via the `storage` event.
 */
export function useVotes() {
  const [votedIds, setVotedIds] = useState(readVotes)

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setVotedIds(readVotes())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const hasVoted = useCallback((issueId) => votedIds.includes(issueId), [votedIds])

  const markVoted = useCallback((issueId) => {
    setVotedIds((current) => {
      if (current.includes(issueId)) return current
      const next = [...current, issueId]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Vote still counts for this session if storage is unavailable.
      }
      return next
    })
  }, [])

  return { votedIds, hasVoted, markVoted }
}
