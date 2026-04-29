import BlogCardsCSS from "../assets/styles/BlogCards.module.css"
import { Link } from "react-router-dom"
import { useEffect, useState, useMemo } from 'react'
import { fetchBlogsData } from "../features/blogCards/blogCardsSlice"
import { useDispatch, useSelector } from "react-redux"

// ── Skeleton placeholder shown while loading ──────────────────────────────────
function SkeletonCard() {
    return (
        <div className={BlogCardsCSS.skeleton}>
            <div className={BlogCardsCSS.skeletonImg} />
            <div className={BlogCardsCSS.skeletonBody}>
                <div className={BlogCardsCSS.skeletonLine} style={{ height: 18, width: '80%' }} />
                <div className={BlogCardsCSS.skeletonLine} style={{ height: 13, width: '100%' }} />
                <div className={BlogCardsCSS.skeletonLine} style={{ height: 13, width: '65%' }} />
                <div className={BlogCardsCSS.skeletonLine} style={{ height: 11, width: '40%', marginTop: 6 }} />
            </div>
        </div>
    )
}

// ── Single blog card ──────────────────────────────────────────────────────────
function BlogCard({ item }) {
    const imgSrc = `../../career_counselling_portal/Counsellors/${item.counsellor_email}/Blogs/${item.cover_image}`
    const authorInitial = (item.author_name || "A").charAt(0).toUpperCase()

    return (
        <Link className={BlogCardsCSS.card} to={`/${item.id}`}>
            {/* Cover image */}
            <div className={BlogCardsCSS.cardCover}>
                <img
                    className={BlogCardsCSS.cardCoverImg}
                    src={imgSrc}
                    alt={item.title}
                    onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                    }}
                />
                <div className={BlogCardsCSS.cardCoverFallback} style={{ display: 'none' }}>
                    <i className={`fa-solid fa-newspaper ${BlogCardsCSS.cardCoverFallbackIcon}`} />
                </div>

                {/* Date badge */}
                {item.created_at && (
                    <div className={BlogCardsCSS.date}>
                        <i className="fa-regular fa-calendar" style={{ marginRight: 5, fontSize: 10 }} />
                        {item.created_at}
                    </div>
                )}

                {/* Field-of-study pill */}
                {item.area_of_field && (
                    <div className={BlogCardsCSS.fieldTag}>{item.area_of_field}</div>
                )}
            </div>

            {/* Text body */}
            <div className={BlogCardsCSS.cardBody}>
                <h2 className={BlogCardsCSS.cardTitle}>{item.title}</h2>

                {item.description && (
                    <p
                        className={BlogCardsCSS.cardExcerpt}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                )}

                {/* Footer: author + read more */}
                <div className={BlogCardsCSS.cardFooter}>
                    <div className={BlogCardsCSS.authorRow}>
                        <div className={BlogCardsCSS.authorAvatar}>{authorInitial}</div>
                        <span className={BlogCardsCSS.authorName}>{item.author_name}</span>
                    </div>
                    <span className={BlogCardsCSS.readMore}>
                        Read
                        <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
                    </span>
                </div>
            </div>
        </Link>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Blogs() {
    const dispatch = useDispatch()
    const { blogsDataList } = useSelector(state => state.blogsCard)

    const [search, setSearch] = useState("")
    const [fieldFilter, setFieldFilter] = useState("")
    const [sort, setSort] = useState("newest")

    useEffect(() => { dispatch(fetchBlogsData()) }, [dispatch])

    const uniqueFields = useMemo(() => {
        if (!blogsDataList?.length) return []
        return [...new Set(blogsDataList.map(b => b.area_of_field).filter(Boolean))].sort()
    }, [blogsDataList])

    const filtered = useMemo(() => {
        if (!blogsDataList?.length) return []
        const q = search.toLowerCase()
        return blogsDataList
            .filter(b => {
                const matchSearch = !q ||
                    b.title?.toLowerCase().includes(q) ||
                    b.author_name?.toLowerCase().includes(q) ||
                    b.area_of_field?.toLowerCase().includes(q)
                const matchField = !fieldFilter || b.area_of_field === fieldFilter
                return matchSearch && matchField
            })
            .slice()
            .sort((a, b) => {
                const da = new Date(a.created_at), db = new Date(b.created_at)
                return sort === "newest" ? db - da : da - db
            })
    }, [blogsDataList, search, fieldFilter, sort])

    const hasFilters = search || fieldFilter || sort !== "newest"
    const isLoading = !blogsDataList

    return (
        <div id="blogCards" className={BlogCardsCSS.overAll}>

            {/* ── Hero banner ── */}
            <div className={BlogCardsCSS.hero}>
                <h1 className={BlogCardsCSS.mainHeading}>Our Blog</h1>
                <p className={BlogCardsCSS.sectionSubtitle}>
                    Expert career articles written by our verified counsellors
                </p>
            </div>

            {/* ── Filter bar — only if data loaded ── */}
            {!isLoading && blogsDataList.length > 0 && (
                <div className={BlogCardsCSS.filterBar}>
                    <div className={BlogCardsCSS.searchWrap}>
                        <i className={`fa-solid fa-magnifying-glass ${BlogCardsCSS.searchIcon}`} />
                        <input
                            className={BlogCardsCSS.searchInput}
                            placeholder="Search title, author, or field…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className={BlogCardsCSS.clearBtn} onClick={() => setSearch("")}>✕</button>
                        )}
                    </div>

                    <select className={BlogCardsCSS.filterSelect} value={fieldFilter} onChange={e => setFieldFilter(e.target.value)}>
                        <option value="">All fields</option>
                        {uniqueFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>

                    <select className={BlogCardsCSS.filterSelect} value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>

                    {hasFilters && (
                        <button className={BlogCardsCSS.clearAllBtn}
                            onClick={() => { setSearch(""); setFieldFilter(""); setSort("newest") }}>
                            Clear all
                        </button>
                    )}
                </div>
            )}

            {/* ── Results count ── */}
            {!isLoading && blogsDataList.length > 0 && (
                <div className={BlogCardsCSS.resultsCount}>
                    {hasFilters
                        ? `${filtered.length} of ${blogsDataList.length} articles`
                        : `${blogsDataList.length} article${blogsDataList.length !== 1 ? "s" : ""}`}
                </div>
            )}

            {/* ── Grid ── */}
            <section className={BlogCardsCSS.cardsWrapper}>
                {isLoading ? (
                    // Skeleton placeholders
                    [1, 2, 3].map(n => <SkeletonCard key={n} />)
                ) : blogsDataList.length === 0 ? (
                    <div className={BlogCardsCSS.emptyState}>
                        <div className={BlogCardsCSS.emptyIcon}>✍️</div>
                        <div className={BlogCardsCSS.emptyTitle}>No articles yet</div>
                        <div className={BlogCardsCSS.emptySub}>Check back soon — our counsellors are writing!</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className={BlogCardsCSS.emptyState}>
                        <div className={BlogCardsCSS.emptyIcon}>📭</div>
                        <div className={BlogCardsCSS.emptyTitle}>No articles match your search</div>
                        <div className={BlogCardsCSS.emptySub}>Try different keywords or clear your filters.</div>
                        <button className={BlogCardsCSS.emptyResetBtn}
                            onClick={() => { setSearch(""); setFieldFilter(""); setSort("newest") }}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    filtered.map(item => <BlogCard key={item.id} item={item} />)
                )}
            </section>
        </div>
    )
}
