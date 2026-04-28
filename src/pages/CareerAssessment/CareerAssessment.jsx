import React from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { authenticate } from "../../features/authentication/authenticationSlice"
import styles from "./CareerAssessment.module.css"

axios.defaults.withCredentials = true

const STEPS = {
  INTRO:      "intro",
  PROFILE:    "profile",    // collect class/stream if missing
  GENERATING: "generating", // AI generating questions
  QUIZ:       "quiz",
  SUBMITTING: "submitting",
  RESULT:     "result",
  ERROR:      "error",
}

const CLASS_OPTIONS = ["5","6","7","8","9","10","11","12"]
const STREAM_OPTIONS = ["Science","Commerce","Arts / Humanities","Vocational","Not decided yet"]

export default function CareerAssessment() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const auth      = useSelector((s) => s.authentication)
  const { is_exist, school, stream, age, gender, isLoading: authLoading } = auth

  const [step, setStep]           = React.useState(STEPS.INTRO)
  const [profile, setProfile]     = React.useState({})   // class_level, stream, school, age, gender
  const [questions, setQuestions] = React.useState([])
  const [current, setCurrent]     = React.useState(0)
  const [answers, setAnswers]     = React.useState([])
  const [result, setResult]       = React.useState("")
  const [errMsg, setErrMsg]       = React.useState("")

  // local form state for profile collection
  const [localClass,  setLocalClass]  = React.useState("")
  const [localStream, setLocalStream] = React.useState("")

  // Refresh auth on mount so profile fields are current
  React.useEffect(() => {
    dispatch(authenticate())
  }, [dispatch])

  // ── helpers ──────────────────────────────────────────────────────────────
  const buildProfile = (classLevel, streamVal) => ({
    class_level: classLevel || "",
    stream:      streamVal  || stream || "",
    school:      school     || "",
    age:         age        || "",
    gender:      gender     || "",
  })

  const fetchQuestions = async (profileObj) => {
    setStep(STEPS.GENERATING)
    setErrMsg("")
    console.log("[Assessment] Requesting questions for profile:", profileObj)
    try {
      const res = await axios.post("http://127.0.0.1:8000/generateAssessmentQuestions", { profile: profileObj })
      console.log("[Assessment] Questions response:", res.data)
      if (res.data.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions)
        setAnswers(Array(res.data.questions.length).fill(null))
        setCurrent(0)
        setStep(STEPS.QUIZ)
      } else {
        throw new Error(res.data.error || "No questions returned")
      }
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Could not generate questions."
      console.error("[Assessment] Question generation failed:", msg)
      setErrMsg(msg)
      setStep(STEPS.ERROR)
    }
  }

  const handleStartFromIntro = () => {
    setStep(STEPS.PROFILE)
  }

  const handleProfileSubmit = () => {
    if (!localClass) return
    const p = buildProfile(localClass, localStream)
    setProfile(p)
    fetchQuestions(p)
  }

  const handleSelect = (opt) => {
    const updated = [...answers]
    updated[current] = opt
    setAnswers(updated)
  }

  const handleSubmitAnswers = async () => {
    setStep(STEPS.SUBMITTING)
    setErrMsg("")
    const payload = {
      answers: questions.map((q, i) => ({ question: q.question, answer: answers[i] || "No answer" })),
      profile,
    }
    console.log("[Assessment] Submitting answers:", payload)
    try {
      const res = await axios.post("http://127.0.0.1:8000/assessCareer", payload)
      console.log("[Assessment] Career result received")
      if (res.data.result) {
        setResult(res.data.result)
        setStep(STEPS.RESULT)
      } else {
        throw new Error(res.data.error || "Empty result from AI")
      }
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Assessment service unavailable."
      console.error("[Assessment] Career suggestion failed:", msg)
      setErrMsg(msg)
      setStep(STEPS.ERROR)
    }
  }

  const handleRestart = () => {
    setAnswers([])
    setQuestions([])
    setCurrent(0)
    setProfile({})
    setLocalClass("")
    setLocalStream("")
    setResult("")
    setErrMsg("")
    setStep(STEPS.INTRO)
  }

  const progress    = questions.length ? Math.round(((current + 1) / questions.length) * 100) : 0
  const allAnswered = answers.length > 0 && answers.every(a => a !== null)

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (step === STEPS.INTRO) {
    return (
      <div className={styles.page}>
        <div className={styles.heroBanner}>
          <div className={styles.heroLeft}>
            <span className={styles.heroTag}>For Class 5 – 12 Students</span>
            <h1 className={styles.heroTitle}>Discover Your Career Path</h1>
            <p className={styles.heroDesc}>
              Not sure what to choose after school? Answer a few questions and our AI will
              suggest career paths personalised to your class, stream, and interests.
            </p>
            <ul className={styles.heroPoints}>
              <li><i className="fa-solid fa-circle-check"></i> Questions tailored to your class &amp; stream</li>
              <li><i className="fa-solid fa-circle-check"></i> AI-powered personalised suggestions</li>
              <li><i className="fa-solid fa-circle-check"></i> No right or wrong answers</li>
              <li><i className="fa-solid fa-circle-check"></i> Free &amp; takes only 5 minutes</li>
            </ul>
            {!is_exist && (
              <p className={styles.loginHint}>
                <i className="fa-solid fa-circle-info"></i>{" "}
                <span className={styles.loginLink} onClick={() => navigate("/login")}>Log in</span>{" "}
                and fill your profile for even more personalised questions.
              </p>
            )}
            {is_exist && stream && (
              <p className={styles.profileDetected}>
                <i className="fa-solid fa-user-check"></i>{" "}
                Profile detected — {stream} stream. Questions will be personalised for you.
              </p>
            )}
            <button className={styles.startBtn} onClick={handleStartFromIntro}>
              Start Assessment <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroIcon}><i className="fa-solid fa-compass"></i></div>
            <div className={styles.statsRow}>
              <div className={styles.stat}><span className={styles.statNum}>AI</span><span className={styles.statLabel}>Tailored</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>5 min</span><span className={styles.statLabel}>Duration</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>Free</span><span className={styles.statLabel}>Always</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── PROFILE COLLECTION (guest or no age on profile) ───────────────────────
  if (step === STEPS.PROFILE) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-user-graduate"></i> Tell us about yourself</h2>
          <p className={styles.sectionDesc}>We'll use this to generate questions matched to your level.</p>

          <label className={styles.fieldLabel}>Which class are you currently in? *</label>
          <div className={styles.chipRow}>
            {CLASS_OPTIONS.map(cl => (
              <button
                key={cl}
                className={`${styles.chip} ${localClass === cl ? styles.chipSelected : ""}`}
                onClick={() => setLocalClass(cl)}
              >
                Class {cl}
              </button>
            ))}
          </div>

          {localClass && parseInt(localClass) >= 11 && (
            <>
              <label className={styles.fieldLabel} style={{ marginTop: 20 }}>What is your stream?</label>
              <div className={styles.chipRow}>
                {STREAM_OPTIONS.map(s => (
                  <button
                    key={s}
                    className={`${styles.chip} ${localStream === s ? styles.chipSelected : ""}`}
                    onClick={() => setLocalStream(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {localClass && parseInt(localClass) >= 8 && parseInt(localClass) <= 10 && (
            <>
              <label className={styles.fieldLabel} style={{ marginTop: 20 }}>Do you have a subject preference? (optional)</label>
              <div className={styles.chipRow}>
                {["Science & Maths","Biology","Computer Science","Commerce","Arts & Humanities","Not sure yet"].map(s => (
                  <button
                    key={s}
                    className={`${styles.chip} ${localStream === s ? styles.chipSelected : ""}`}
                    onClick={() => setLocalStream(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className={styles.navRow} style={{ marginTop: 28 }}>
            <button className={styles.navBtn} onClick={() => setStep(STEPS.INTRO)}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <button
              className={`${styles.navBtn} ${styles.submitBtn}`}
              disabled={!localClass}
              onClick={handleProfileSubmit}
            >
              Generate My Questions <i className="fa-solid fa-wand-magic-sparkles"></i>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── GENERATING QUESTIONS ──────────────────────────────────────────────────
  if (step === STEPS.GENERATING) {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: "center", padding: "60px 40px" }}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Creating your personalised questions…</p>
          <p className={styles.loadingSubText}>Our AI is drafting questions based on your class and stream.</p>
        </div>
      </div>
    )
  }

  // ── SUBMITTING ANSWERS ────────────────────────────────────────────────────
  if (step === STEPS.SUBMITTING) {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: "center", padding: "60px 40px" }}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Analysing your answers…</p>
          <p className={styles.loadingSubText}>Our AI is putting together career suggestions just for you.</p>
        </div>
      </div>
    )
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (step === STEPS.ERROR) {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: "center", padding: "60px 40px" }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 48, color: "#e53935", marginBottom: 18 }}></i>
          <h2 style={{ fontFamily: "var(--fontHeading)", color: "#1a237e", marginBottom: 10 }}>Something went wrong</h2>
          <p style={{ color: "#666", marginBottom: 28, fontSize: 14, maxWidth: 460, margin: "0 auto 28px" }}>{errMsg}</p>
          <button className={styles.startBtn} style={{ maxWidth: 200, margin: "0 auto" }} onClick={handleRestart}>Try Again</button>
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (step === STEPS.RESULT) {
    return (
      <div className={styles.page}>
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <i className="fa-solid fa-star" style={{ color: "#fdd835", fontSize: 22 }}></i>
            <h2 className={styles.resultTitle}>Your Career Recommendations</h2>
          </div>
          <div className={styles.resultBody}>
            {result.split('\n').map((line, i) => {
              const trimmed = line.trim()
              if (!trimmed) return <div key={i} style={{ height: 6 }} />
              if (/^\d+\./.test(trimmed))
                return <p key={i} className={styles.resultCareerTitle}>{trimmed}</p>
              return <p key={i} className={styles.resultLine}>{trimmed}</p>
            })}
          </div>
          <div className={styles.resultActions}>
            <button className={styles.restartBtn} onClick={handleRestart}>
              <i className="fa-solid fa-rotate-left"></i> Retake
            </button>
            <button className={styles.counsellorBtn} onClick={() => navigate("/askCounsellor")}>
              <i className="fa-solid fa-user-tie"></i> Talk to a Counsellor
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  const q = questions[current]
  if (!q) return null
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Question {current + 1} of {questions.length}</span>
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <p className={styles.questionText}>{q.question}</p>

        <div className={styles.options}>
          {(q.options || []).map((opt, i) => (
            <button
              key={i}
              className={`${styles.option} ${answers[current] === opt ? styles.optionSelected : ""}`}
              onClick={() => handleSelect(opt)}
            >
              <span className={styles.optionBullet}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>

        <div className={styles.navRow}>
          <button className={styles.navBtn} onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
          {current < questions.length - 1 ? (
            <button className={styles.navBtn} onClick={() => setCurrent(c => c + 1)} disabled={!answers[current]}>
              Next <i className="fa-solid fa-arrow-right"></i>
            </button>
          ) : (
            <button
              className={`${styles.navBtn} ${styles.submitBtn}`}
              onClick={handleSubmitAnswers}
              disabled={!allAnswered}
            >
              Get Results <i className="fa-solid fa-wand-magic-sparkles"></i>
            </button>
          )}
        </div>
        {!answers[current] && (
          <p className={styles.selectHint}>Select an option to continue</p>
        )}
      </div>
    </div>
  )
}
