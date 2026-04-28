import React from "react"
import SuccessCSS from "../assets/styles/SignupSuccess.module.css"
import TickMark from "../assets/images/SignupSuccess_TickMark.gif"

export default function SignupSuccess(){
    return (
        <div className={SuccessCSS.page}>
            <div className={SuccessCSS.thanksContainer}>
                <img className={SuccessCSS.checkMark} src={TickMark} alt=""/>
                <h1 className={SuccessCSS.thanksHeading}>THANK YOU!</h1>
                <p className={SuccessCSS.thanksParagraph}>
                    Thank you for registering. After verification, a confirmation email will be sent to you. Stay Tuned.
                </p>
            </div>
        </div>
    )
}