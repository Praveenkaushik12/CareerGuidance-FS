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

        {/* Career Assessment highlight banner */}
        <div className={HomeCSS.assessmentSection}>
            <div className={HomeCSS.assessmentContent}>
                <div className={HomeCSS.assessmentIcon}>
                    <i className="fa-solid fa-compass"></i>
                </div>
                <div className={HomeCSS.assessmentText}>
                    <span className={HomeCSS.assessmentTag}>For Class 5 – 12 Students</span>
                    <h2 className={HomeCSS.assessmentTitle}>Don't Know What Career to Choose?</h2>
                    <p className={HomeCSS.assessmentDesc}>
                        Take our free 5-minute Career Path Assessment — answer 10 simple questions
                        and get AI-powered career suggestions personalised just for you.
                    </p>
                </div>
                <Link to="careerAssessment" className={HomeCSS.assessmentBtn}>
                    Start Assessment <i className="fa-solid fa-arrow-right"></i>
                </Link>
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
