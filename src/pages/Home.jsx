import Hero from "./Hero"
import BlogCards from "./BlogCards"
import Reviews from "./Reviews"
import Icon from "../assets/images/CareerGPT_Bot.gif"
import HomeCSS from "../assets/styles/Home.module.css"
import { Link } from "react-router-dom"

export default function Home(){
    return(
        <>
        <Hero />

        {/* Career Exploration flash banner — primary feature, shown first after hero */}
        <div style={{
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            padding: '56px 24px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(138,43,226,0.18)', filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,212,255,0.14)', filter: 'blur(50px)' }} />

            <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
                <span style={{ display: 'inline-block', background: 'rgba(138,43,226,0.35)', color: '#c084fc', borderRadius: 99, padding: '5px 16px', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18, border: '1px solid rgba(192,132,252,0.3)' }}>
                    ✨ Career Exploration Hub
                </span>
                <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, margin: '0 0 14px', fontFamily: 'var(--fontHeading)', lineHeight: 1.25 }}>
                    Explore Your Perfect Career
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 32, lineHeight: 1.7, fontFamily: 'var(--fontHeading)' }}>
                    Career Roadmap · Salary Explorer · Career Paths · Skills Matcher · Day-in-the-Life · Industry Explorer — all in one interactive toolkit.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
                    {['🗺 Career Roadmap', '💰 Salary Explorer', '📈 Career Paths', '🛠 Skills Matcher', '🏭 Industry Explorer'].map(t => (
                        <span key={t} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)' }}>{t}</span>
                    ))}
                </div>
                <Link to="careerExploration" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', fontFamily: 'var(--fontHeading)' }}>
                    Start Exploring <i className="fa-solid fa-rocket" />
                </Link>
            </div>
        </div>

        {/* Career Assessment — AI-personalised quiz for students */}
        <div className={HomeCSS.assessmentSection}>
            <div className={HomeCSS.assessmentContent}>
                <div className={HomeCSS.assessmentIcon}>
                    <i className="fa-solid fa-compass"></i>
                </div>
                <div className={HomeCSS.assessmentText}>
                    <span className={HomeCSS.assessmentTag}>For Class 5 – 12 Students</span>
                    <h2 className={HomeCSS.assessmentTitle}>Don't Know What Career to Choose?</h2>
                    <p className={HomeCSS.assessmentDesc}>
                        Take our free 5-minute AI Career Assessment — answer personalised questions
                        and get AI-powered career suggestions tailored to your class and stream.
                    </p>
                </div>
                <Link to="careerAssessment" className={HomeCSS.assessmentBtn}>
                    Start Assessment <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        </div>

        {/* Resource Hub teaser */}
        <div style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #f0f0f8' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ede9fe', color: '#6d28d9', borderRadius: 99, padding: '5px 14px', fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
                        <i className="fa-solid fa-book-open-reader" /> Resource Hub
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: '0 0 12px', fontFamily: 'var(--fontHeading)', lineHeight: 1.3 }}>
                        All the Best Free Resources, in One Place
                    </h3>
                    <p style={{ color: '#666', fontSize: 14, marginBottom: 22, lineHeight: 1.7, fontFamily: 'var(--fontHeading)' }}>
                        Handpicked roadmaps, free courses, scholarship portals, exam guides, and skill-building tools — curated for Indian students. Including a spotlight on <strong>roadmap.sh</strong>, one of the best career roadmap websites out there.
                    </p>
                    <Link to="resourceHub" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--fontHeading)' }}>
                        Browse Resources <i className="fa-solid fa-arrow-right" />
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 380 }}>
                    {[
                        { icon: 'fa-solid fa-map-location-dot', label: 'Career Roadmaps', color: '#7c3aed' },
                        { icon: 'fa-solid fa-graduation-cap',    label: 'Free Courses',     color: '#3b82f6' },
                        { icon: 'fa-solid fa-file-pen',          label: 'Entrance Exams',   color: '#ef4444' },
                        { icon: 'fa-solid fa-hand-holding-dollar', label: 'Scholarships',   color: '#10b981' },
                        { icon: 'fa-solid fa-briefcase',         label: 'Internships',      color: '#f59e0b' },
                        { icon: 'fa-solid fa-wand-magic-sparkles', label: 'Skill Building', color: '#ec4899' },
                    ].map(({ icon, label, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: color + '10', border: `1px solid ${color}25`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 600, color, fontFamily: 'var(--fontHeading)' }}>
                            <i className={icon} />{label}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <BlogCards />
        <Reviews/>

        {/* CareerGPT floating button */}
        <Link className={HomeCSS.openButton} to="careerGPT" title="Chat with CareerGPT">
            <img src={Icon} className={HomeCSS.botIcon} alt="CareerGPT" />
        </Link>
        </>
    )
}
