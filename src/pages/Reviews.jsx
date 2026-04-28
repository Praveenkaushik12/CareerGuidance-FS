import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import {
  handleChange,
  setShowReviewForm,
  setRating,
  saveReviews,
  clearReview,
  getReviews,
  getCounsellorsByUID,
  saveRatings,
  clearRatings
} from "../features/reviews/reviewsSlice"
import ReviewsCSS from "../assets/styles/Reviews.module.css"
import { useNavigate } from "react-router-dom"

export default function Reviews() {
    const dispatch   = useDispatch()
    const navigate   = useNavigate()
    const { reviewsForm, isSave } = useSelector((store) => store.reviews)
    const { is_exist }            = useSelector((store) => store.authentication)
    const showReviewForm          = useSelector((store) => store.reviews.showReviewForm)
    const latestReviews           = useSelector((store) => store.reviews.latestReviews)
    const counsellorList          = useSelector((store) => store.reviews.counsellorList)

    useEffect(() => {
        dispatch(getReviews())
        dispatch(getCounsellorsByUID())
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        if (is_exist) {
            showReviewForm ? dispatch(saveReviews({ reviewsForm })) : dispatch(saveRatings({ reviewsForm }))
            showReviewForm ? dispatch(clearReview()) : dispatch(clearRatings())
        } else {
            showReviewForm ? dispatch(clearReview()) : dispatch(clearRatings())
            navigate("/login")
        }
    }

    const approvedReviews = latestReviews && Array.isArray(latestReviews)
        ? latestReviews.filter(r => r.is_approved)
        : []

    return (
        <>
        {/* ── Submit section ── */}
        <div id="reviews" className={ReviewsCSS.wrapper}>
            <div className={ReviewsCSS.submitSection}>
                {/* Tabs */}
                <div className={ReviewsCSS.submitTabs}>
                    <button
                        className={`${ReviewsCSS.tabBtn} ${showReviewForm ? ReviewsCSS.tabBtnActive : ''}`}
                        onClick={() => dispatch(setShowReviewForm(true))}
                    >
                        <i className="fa-solid fa-comment-dots"></i> Write a Review
                    </button>
                    <button
                        className={`${ReviewsCSS.tabBtn} ${!showReviewForm ? ReviewsCSS.tabBtnActive : ''}`}
                        onClick={() => dispatch(setShowReviewForm(false))}
                    >
                        <i className="fa-solid fa-star"></i> Rate a Counsellor
                    </button>
                </div>

                <form className={ReviewsCSS.form} onSubmit={handleSubmit}>
                    {showReviewForm ? (
                        <>
                            <div className={ReviewsCSS.formHolder}>
                                <span><i className="fa-regular fa-user"></i></span>
                                <input
                                    type="text"
                                    className={ReviewsCSS.formControl}
                                    value={reviewsForm.name}
                                    placeholder="Your name"
                                    name="name"
                                    onChange={e => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className={ReviewsCSS.formHolder}>
                                <span><i className="fa-regular fa-envelope"></i></span>
                                <input
                                    type="email"
                                    className={ReviewsCSS.formControl}
                                    value={reviewsForm.email}
                                    placeholder="Your email"
                                    name="email"
                                    onChange={e => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className={ReviewsCSS.formHolder}>
                                <span style={{ top: 18 }}><i className="fa-regular fa-comment"></i></span>
                                <textarea
                                    className={ReviewsCSS.formControl}
                                    value={reviewsForm.comments}
                                    placeholder="Share your experience…"
                                    name="comments"
                                    rows={4}
                                    onChange={e => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={ReviewsCSS.formHolder}>
                                <span><i className="fa-solid fa-user-tie"></i></span>
                                <select
                                    className={ReviewsCSS.formControl}
                                    name="selectedOption"
                                    onChange={e => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                                    required
                                >
                                    <option value="" disabled selected>Select a Counsellor</option>
                                    {counsellorList ? counsellorList.map(item => (
                                        <option key={item.counsellor_id} value={item.counsellor_id}>{item.name}</option>
                                    )) : (
                                        <option disabled>Login to rate counsellors</option>
                                    )}
                                </select>
                            </div>
                            <div className={ReviewsCSS.formHolder}>
                                <span style={{ top: 18 }}><i className="fa-regular fa-comment"></i></span>
                                <textarea
                                    className={ReviewsCSS.formControl}
                                    value={reviewsForm.counsellorReview}
                                    placeholder="Your review about this counsellor…"
                                    name="counsellorReview"
                                    rows={4}
                                    onChange={e => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                                    required
                                />
                            </div>
                            <p className={ReviewsCSS.rateHeading}>Rate this Counsellor</p>
                            <div className={ReviewsCSS.rating}>
                                {[5,4,3,2,1].map(n => (
                                    <label key={n} htmlFor={`star${n}`} onClick={() => {
                                        dispatch(setRating({ rating: n }))
                                        dispatch(handleChange({ name: 'rating', value: n }))
                                    }} />
                                ))}
                                {[5,4,3,2,1].map(n => (
                                    <input key={n} type="radio" id={`star${n}`} name="rating" value={n} required />
                                ))}
                            </div>
                        </>
                    )}

                    <button className={ReviewsCSS.submitBtn} type="submit">
                        <i className="fa-solid fa-paper-plane"></i> Submit
                    </button>
                    {isSave && <p className={ReviewsCSS.successMsg}>✓ Saved successfully!</p>}
                </form>
            </div>
        </div>

        {/* ── Latest Reviews grid ── */}
        <div className={ReviewsCSS.latestSection}>
            <div className={ReviewsCSS.sectionHeader}>
                <h2 className={ReviewsCSS.heading}>What Students Say</h2>
            </div>
            <div className={ReviewsCSS.reviewCards}>
                {approvedReviews.length === 0 ? (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '32px 0' }}>
                        No reviews yet. Be the first!
                    </p>
                ) : approvedReviews.map(item => (
                    <div className={ReviewsCSS.singleCard} key={item.id}>
                        <h5 className={ReviewsCSS.name}>
                            <i className="fa-solid fa-user-circle" style={{ marginRight: 8, opacity: 0.6 }}></i>
                            {item.reviewer_name}
                        </h5>
                        <p className={ReviewsCSS.body}>{item.reviewer_description}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}
