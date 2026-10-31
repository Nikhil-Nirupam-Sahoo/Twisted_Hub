import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  CircleCheck,
  Lightbulb,
  LoaderCircle,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { CATEGORIES } from '../lib/constants'
import { createIssue } from '../lib/issues'

const INITIAL_VALUES = { category: '', location: '', description: '' }

function validate(values) {
  const errors = {}

  if (!values.category) errors.category = 'Choose the category that fits best.'

  if (!values.location.trim()) {
    errors.location = 'Tell us where the issue is.'
  } else if (values.location.trim().length < 3) {
    errors.location = 'Add a little more detail about the location.'
  } else if (values.location.trim().length > 120) {
    errors.location = 'Keep the location under 120 characters.'
  }

  if (!values.description.trim()) {
    errors.description = 'Describe the issue you are reporting.'
  } else if (values.description.trim().length < 15) {
    errors.description = 'Add at least 15 characters so staff can understand the issue.'
  } else if (values.description.trim().length > 1000) {
    errors.description = 'Keep the description under 1000 characters.'
  }

  return errors
}

export default function ReportPage() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [createdId, setCreatedId] = useState(null)

  const updateField = (field) => (event) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstField = Object.keys(nextErrors)[0]
      document.getElementById(`report-${firstField}`)?.focus()
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const issueId = await createIssue(values)
      setCreatedId(issueId)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('[issues] create failed', error)
      setSubmitError(
        'Your report could not be submitted. Please check your connection and try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const reportAnother = () => {
    setValues(INITIAL_VALUES)
    setErrors({})
    setCreatedId(null)
    setSubmitError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Back to issue board
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.28em] text-fuchsia-300 uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            New quest
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Report an issue
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Something broken, unsafe, or just not working? Tell us about it. Your report appears
            on the public board right away — no account, name, or email needed.
          </p>

          {createdId ? (
            <div className="card mt-8">
              <div className="border-b border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 to-transparent px-6 py-10 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 shadow-[0_0_35px_-8px_rgba(52,211,153,0.8)]">
                  <CircleCheck className="size-8" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
                  Issue reported
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                  Thanks for speaking up. Your issue is now live on the public board, where other
                  students can upvote it.
                </p>
              </div>
              <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center">
                <Link to="/" className="btn btn-primary">
                  View it on the issue board
                </Link>
                <button type="button" onClick={reportAnother} className="btn btn-secondary">
                  Report another issue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="card mt-8 p-6 sm:p-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="report-category" className="field-label">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="report-category"
                    value={values.category}
                    onChange={updateField('category')}
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={errors.category ? 'report-category-error' : undefined}
                    className={`field cursor-pointer ${errors.category ? 'field-error' : ''}`}
                  >
                    <option value="">Select a category…</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.emoji} {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p id="report-category-error" className="mt-1.5 text-xs text-rose-300">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="report-location" className="field-label">
                    Location <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="report-location"
                      type="text"
                      value={values.location}
                      onChange={updateField('location')}
                      maxLength={120}
                      placeholder="e.g. Central Library — 2nd floor"
                      aria-invalid={Boolean(errors.location)}
                      aria-describedby={errors.location ? 'report-location-error' : undefined}
                      className={`field pl-10 ${errors.location ? 'field-error' : ''}`}
                    />
                  </div>
                  {errors.location && (
                    <p id="report-location-error" className="mt-1.5 text-xs text-rose-300">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="report-description" className="field-label">
                      Description <span className="text-rose-400">*</span>
                    </label>
                    <span className="mb-1.5 text-xs tabular-nums text-slate-400">
                      {values.description.length}/1000
                    </span>
                  </div>
                  <textarea
                    id="report-description"
                    value={values.description}
                    onChange={updateField('description')}
                    rows={6}
                    maxLength={1000}
                    placeholder="What is wrong, how long has it been happening, and how is it affecting students?"
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? 'report-description-error' : undefined}
                    className={`field resize-y ${errors.description ? 'field-error' : ''}`}
                  />
                  {errors.description ? (
                    <p id="report-description-error" className="mt-1.5 text-xs text-rose-300">
                      {errors.description}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Include any details that would help staff find and fix the issue.
                    </p>
                  )}
                </div>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {submitError}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="size-4 text-emerald-400" aria-hidden="true" />
                  Anonymous — we never ask for your identity.
                </p>
                <button type="submit" disabled={submitting} className="btn btn-primary sm:w-auto">
                  {submitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden="true" />
                      Submit report
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
                <Lightbulb className="size-4" aria-hidden="true" />
              </span>
              <h2 className="font-display text-sm font-semibold text-white">
                What makes a good report?
              </h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                <span>
                  <span className="font-medium text-white">Be specific.</span> Name the building,
                  floor, room number, or stop.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
                <span>
                  <span className="font-medium text-white">Describe the impact.</span> How is it
                  affecting students, classes, or safety?
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                <span>
                  <span className="font-medium text-white">One issue per report.</span> This keeps
                  upvotes and updates meaningful.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-cyan-300" aria-hidden="true" />
              <h2 className="font-display text-sm font-semibold text-cyan-100">Your privacy</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-cyan-100/80">
              Reports are fully anonymous. We do not collect names, email addresses, roll numbers,
              or account information — and nobody can trace a report back to you.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
