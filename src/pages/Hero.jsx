import HeroCSS from "../assets/styles/Hero.module.css"
import heroImage from "../assets/images/Hero_main.png"
import { Link } from "react-router-dom"

export default function Hero() {
    return (
        <section className={HeroCSS.hero}>
            <div className={HeroCSS.heroInner}>
                {/* Left: text content */}
                <div className={HeroCSS.heroText}>
                    <span className={HeroCSS.heroBadge}>
                        <i className="fa-solid fa-bolt"></i> AI-Powered Career Guidance
                    </span>
                    <h1 className={HeroCSS.heroTitle}>
                        Find Your <span className={HeroCSS.highlight}>Dream Career</span><br />
                        with Expert Guidance
                    </h1>
                    <p className={HeroCSS.heroDesc}>
                        CareerGuidance connects students with verified career counsellors and
                        AI-powered tools to help them discover the right career path based on
                        their interests, strengths, and academic background.
                    </p>
                    <div className={HeroCSS.heroCtas}>
                        <Link to="careerGPT" className={HeroCSS.btnPrimary}>
                            <i className="fa-solid fa-robot"></i> Chat with CareerGPT
                        </Link>
                        <Link to="askCounsellor" className={HeroCSS.btnSecondary}>
                            <i className="fa-solid fa-user-tie"></i> Find a Counsellor
                        </Link>
                    </div>
                    <div className={HeroCSS.heroStats}>
                        <div className={HeroCSS.stat}>
                            <span className={HeroCSS.statNum}>500+</span>
                            <span className={HeroCSS.statLabel}>Students Guided</span>
                        </div>
                        <div className={HeroCSS.statDivider} />
                        <div className={HeroCSS.stat}>
                            <span className={HeroCSS.statNum}>50+</span>
                            <span className={HeroCSS.statLabel}>Expert Counsellors</span>
                        </div>
                        <div className={HeroCSS.statDivider} />
                        <div className={HeroCSS.stat}>
                            <span className={HeroCSS.statNum}>Free</span>
                            <span className={HeroCSS.statLabel}>AI Assessment</span>
                        </div>
                    </div>
                </div>

                {/* Right: image + floating chips */}
                <div className={HeroCSS.heroVisual}>
                    <div className={HeroCSS.imageWrap}>
                        <img src={heroImage} alt="Career Guidance" className={HeroCSS.heroImg} />
                        <div className={HeroCSS.floatCard} style={{ top: "12%", right: "-18px" }}>
                            <i className="fa-solid fa-star" style={{ color: "var(--yellow)" }}></i>
                            <span>Top Rated Counsellors</span>
                        </div>
                        <div className={HeroCSS.floatCard} style={{ bottom: "18%", left: "-18px" }}>
                            <i className="fa-solid fa-brain" style={{ color: "var(--purple)" }}></i>
                            <span>AI Career Match</span>
                        </div>
                        <div className={HeroCSS.floatBadge}>
                            <i className="fa-solid fa-shield-halved"></i> Verified Experts
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave separator */}
            <div className={HeroCSS.wave}>
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
                </svg>
            </div>
        </section>
    )
}
