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
        <div id="blogCards" className={`${BlogCardsCSS.overAll} mt-5`}>
            <div className={`${BlogCardsCSS.mainHeading} text-center`}>
                <h1>All Blogs</h1>
            </div>
            <section className={BlogCardsCSS.cardsWrapper}>
                {!blogsDataList ? (
                    <p style={{ textAlign: 'center', color: '#888', width: '100%' }}>Loading...</p>
                ) : blogsDataList.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', width: '100%', fontSize: '18px', padding: '40px 0' }}>
                        No blogs published yet. Check back soon!
                    </p>
                ) : (
                    blogsDataList.map(item => (
                        <div className={BlogCardsCSS.cardGridSpace} key={item.id}>
                            <Link
                                className={BlogCardsCSS.card}
                                to={`/${item.id}`}
                                style={{ backgroundImage: `url("../../career_counselling_portal/Counsellors/${item.counsellor_email}/Blogs/${item.cover_image}")` }}
                            >
                                <div>
                                    <h1>{item.title}</h1>
                                    <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                                    <div className={BlogCardsCSS.date}>{item.created_at}</div>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </section>
        </div>
    )
}
