import BlogCardsCSS from "../assets/styles/BlogCards.module.css"
import { Link } from "react-router-dom"
import { useEffect } from 'react'
import { fetchBlogsData } from "../features/blogCards/blogCardsSlice"
import { useDispatch, useSelector } from "react-redux"

export default function Blogs() {
    const dispatch = useDispatch()
    const { blogsDataList } = useSelector(state => state.blogsCard)

    useEffect(() => {
        dispatch(fetchBlogsData())
    }, [dispatch])

    return (
        <div id="blogCards" className={BlogCardsCSS.overAll}>
            <div className={BlogCardsCSS.sectionHeader}>
                <h2 className={BlogCardsCSS.mainHeading}>All Blogs</h2>
                <p className={BlogCardsCSS.sectionSubtitle}>Browse all articles from our counsellors</p>
            </div>

            <section className={BlogCardsCSS.cardsWrapper}>
                {!blogsDataList ? (
                    <p style={{ textAlign: 'center', color: '#888', gridColumn: '1/-1', padding: '40px 0' }}>Loading…</p>
                ) : blogsDataList.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', gridColumn: '1/-1', fontSize: 16, padding: '40px 0' }}>
                        No blogs published yet. Check back soon!
                    </p>
                ) : (
                    blogsDataList.map(item => (
                        <Link
                            key={item.id}
                            className={BlogCardsCSS.card}
                            to={`/${item.id}`}
                            style={{ backgroundImage: `url("../../career_counselling_portal/Counsellors/${item.counsellor_email}/Blogs/${item.cover_image}")` }}
                        >
                            <div className={BlogCardsCSS.date}>{item.created_at}</div>
                            <div>
                                <h1>{item.title}</h1>
                                <p dangerouslySetInnerHTML={{ __html: item.description }} />
                            </div>
                        </Link>
                    ))
                )}
            </section>
        </div>
    )
}
