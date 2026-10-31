const STORAGE_KEY = 'campus-issues-demo-v1'

const hoursAgo = (hours) => Date.now() - hours * 60 * 60 * 1000

const SEED_ISSUES = [
  {
    id: 'demo-library-wifi',
    category: 'wifi',
    location: 'Central Library — 2nd floor',
    description:
      'Wi-Fi on the second floor of the library disconnects every 10–15 minutes. Online exams and research databases keep timing out, and the help desk says it is a campus-wide problem.',
    status: 'in_progress',
    upvotes: 47,
    createdAt: hoursAgo(52),
  },
  {
    id: 'demo-hostel-ac',
    category: 'hostel',
    location: 'Hostel Block C — Common Room',
    description:
      'The common room AC has been broken for three weeks. With temperatures above 35°C, students have stopped using the space entirely and are studying in their rooms instead.',
    status: 'open',
    upvotes: 39,
    createdAt: hoursAgo(122),
  },
  {
    id: 'demo-canteen-leak',
    category: 'canteen',
    location: 'Main Canteen — Serving Counter 2',
    description:
      'The water dispenser next to counter 2 has been leaking since Monday, creating a slippery floor right next to the queue. Someone is going to slip during the lunch rush.',
    status: 'resolved',
    upvotes: 31,
    createdAt: hoursAgo(196),
  },
  {
    id: 'demo-north-gate-lights',
    category: 'safety',
    location: 'North Gate — Pedestrian Crossing',
    description:
      'The street lights near the north gate crossing are out after 8 PM. Students walking back from evening labs have to cross in complete darkness with two-wheelers turning in fast.',
    status: 'open',
    upvotes: 28,
    createdAt: hoursAgo(16),
  },
  {
    id: 'demo-science-fans',
    category: 'maintenance',
    location: 'Science Block — Room 204',
    description:
      'Two ceiling fans in Room 204 make a loud grinding noise and one is wobbling badly. It has been reported twice to the department office with no visit from maintenance.',
    status: 'in_progress',
    upvotes: 22,
    createdAt: hoursAgo(74),
  },
  {
    id: 'demo-hostel-hot-water',
    category: 'hostel',
    location: 'Boys Hostel — Washroom, 3rd Floor',
    description:
      'Only two of the six showers have working hot water. Morning queues are long and the geyser trips the breaker almost every day around 7 AM.',
    status: 'open',
    upvotes: 18,
    createdAt: hoursAgo(28),
  },
  {
    id: 'demo-shuttle-full',
    category: 'transport',
    location: 'Main Gate Bus Stop',
    description:
      'The 7:30 AM shuttle to the city campus is consistently full before it reaches the main gate. Students are left waiting for the next bus and miss their first class.',
    status: 'open',
    upvotes: 15,
    createdAt: hoursAgo(12),
  },
  {
    id: 'demo-exam-clock',
    category: 'academics',
    location: 'Exam Hall B',
    description:
      'The wall clock in Exam Hall B runs about 20 minutes slow. During the last test, many students were caught off guard when the invigilator called time.',
    status: 'resolved',
    upvotes: 11,
    createdAt: hoursAgo(150),
  },
  {
    id: 'demo-parking-breaker',
    category: 'other',
    location: 'Sports Complex — Parking Lot',
    description:
      'The speed breaker near the sports complex parking is unmarked and almost invisible at night. Two scooters scraped their underside there last week.',
    status: 'open',
    upvotes: 9,
    createdAt: hoursAgo(100),
  },
]

let issues = loadIssues()
const listeners = new Set()

function loadIssues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      persist(SEED_ISSUES)
      return [...SEED_ISSUES]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_ISSUES]
  } catch {
    return [...SEED_ISSUES]
  }
}

function persist(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage can be unavailable (private mode); the in-memory copy still works.
  }
}

function snapshot() {
  return [...issues].sort((a, b) => b.upvotes - a.upvotes || b.createdAt - a.createdAt)
}

function emit() {
  const data = snapshot()
  listeners.forEach((listener) => listener(data))
}

export function subscribeToDemoIssues(onData) {
  listeners.add(onData)
  onData(snapshot())

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      issues = loadIssues()
      emit()
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(onData)
    window.removeEventListener('storage', onStorage)
  }
}

export async function createDemoIssue({ category, location, description }) {
  await new Promise((resolve) => setTimeout(resolve, 550))

  const issue = {
    id: `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    category,
    location: location.trim(),
    description: description.trim(),
    status: 'open',
    upvotes: 0,
    createdAt: Date.now(),
  }

  issues = [issue, ...issues]
  persist(issues)
  emit()
  return issue.id
}

export async function upvoteDemoIssue(issueId) {
  await new Promise((resolve) => setTimeout(resolve, 250))

  let found = false
  issues = issues.map((issue) => {
    if (issue.id !== issueId) return issue
    found = true
    return { ...issue, upvotes: issue.upvotes + 1 }
  })

  if (!found) throw new Error('That issue no longer exists.')
  persist(issues)
  emit()
}

export async function updateDemoIssueStatus(issueId, status) {
  await new Promise((resolve) => setTimeout(resolve, 350))

  let found = false
  issues = issues.map((issue) => {
    if (issue.id !== issueId) return issue
    found = true
    return { ...issue, status }
  })

  if (!found) throw new Error('That issue no longer exists.')
  persist(issues)
  emit()
}
