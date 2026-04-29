import BlogCardsCSS from "../assets/styles/BlogCards.module.css"
import { Link } from "react-router-dom"
import { useEffect } from 'react'
import { fetchBlogsData } from "../features/blogCards/blogCardsSlice"
import { useDispatch, useSelector } from "react-redux"

function CompactCard({ item }) {
    const imgSrc = `../../career_counselling_portal/Counsellors/${item.counsellor_email}/Blogs/${item.cover_image}`
    const authorInitial = (item.author_name || "A").charAt(0).toUpperCase()

    return (
        <Link className={BlogCardsCSS.cardCompact} to={`/${item.id}`}>
            {/* Thumbnail */}
            <div className={BlogCardsCSS.cardCompactThumb}>
                <img
                    className={BlogCardsCSS.cardCompactThumbImg}
                    src={imgSrc}
                    alt={item.title}
                    onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                    }}
                />
                <div className={BlogCardsCSS.cardCompactFallback} style={{ display: 'none' }}>
                    <i className="fa-solid fa-newspaper" />
                </div>
            </div>

            {/* Text */}
            <div className={BlogCardsCSS.cardCompactBody}>
                <div className={BlogCardsCSS.cardCompactMeta}>
                    {item.area_of_field && (
                        <span className={BlogCardsCSS.cardCompactField}>{item.area_of_field}</span>
                    )}
                    {item.created_at && (
                        <span className={BlogCardsCSS.cardCompactDate}>{item.created_at}</span>
                    )}
                </div>
                <p className={BlogCardsCSS.cardCompactTitle}>{item.title}</p>
                {item.author_name && (
                    <div className={BlogCardsCSS.cardCompactAuthor}>
                        <i className="fa-solid fa-user-pen" style={{ fontSize: 10 }} />
                        {item.author_name}
                    </div>
                )}
            </div>
        </Link>
    )
}

export default function BlogCards() {
    const dispatch = useDispatch()
    const { blogsDataList } = useSelector(state => state.blogsCard)

    useEffect(() => { dispatch(fetchBlogsData()) }, [dispatch])

    const topBlogs = blogsDataList ? blogsDataList.slice(0, 4) : []

    return (
        <div className={BlogCardsCSS.homeSection}>
            <div className={BlogCardsCSS.homeSectionHeader}>
                <h2 className={BlogCardsCSS.homeSectionTitle}>Latest from Our Blog</h2>
                <p className={BlogCardsCSS.homeSectionSub}>Insights and advice from our expert counsellors</p>
            </div>

            <div className={BlogCardsCSS.compactWrapper}>
                {!blogsDataList ? (
                    // Slim skeleton rows
                    [1, 2, 3, 4].map(n => (
                        <div key={n} className={BlogCardsCSS.cardCompact} style={{ minHeight: 90 }}>
                            <div style={{ width: 110, background: 'linear-gradient(90deg,#eef0f8 25%,#e4e6f4 50%,#eef0f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                            <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div className={BlogCardsCSS.skeletonLine} style={{ height: 12, width: '30%', borderRadius: 6 }} />
                                <div className={BlogCardsCSS.skeletonLine} style={{ height: 15, width: '85%', borderRadius: 6 }} />
                                <div className={BlogCardsCSS.skeletonLine} style={{ height: 11, width: '40%', borderRadius: 6 }} />
                            </div>
                        </div>
                    ))
                ) : blogsDataList.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', fontSize: 15, padding: '24px 0' }}>
                        No blogs published yet. Check back soon!
                    </p>
                ) : (
                    topBlogs.map(item => <CompactCard key={item.id} item={item} />)
                )}
            </div>

            {blogsDataList && blogsDataList.length > 4 && (
                <div className={BlogCardsCSS.viewAllWrap}>
                    <Link to="/blogs" className={BlogCardsCSS.viewAllBtn}>
                        View All Articles <i className="fa-solid fa-arrow-right" />
                    </Link>
                </div>
            )}
        </div>
    )
}
