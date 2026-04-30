import React from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { logout } from "../../features/authentication/authenticationSlice"
import { getCounsellorData } from "../../features/dashboards/counsellor/counsellorSlice"
import useUnreadMessages from "../../hooks/useUnreadMessages"
import CounsellorCSS from "../../assets/styles/dashboards/counsellor_css/Counsellor.module.css"
import FloatingChatBubble from "../../components/FloatingChatBubble"
import Pusher from "pusher-js"

const NAV_ITEMS = [
    { label: 'Dashboard', icon: 'fas fa-gauge-high', to: '/counsellor' },
    { label: 'Add Blog',  icon: 'fa-solid fa-pen-to-square', to: '/counsellor/addBlog' },
    { label: 'My Blogs',  icon: 'fa fa-sticky-note', to: '/counsellor/showBlogs' },
]
const CHAT_ITEM = { label: 'Chat', icon: 'fas fa-comment-dots', to: '/counsellor/counsellorChat' }

function NavLink({ to, icon, label, exact }) {
    const { pathname } = useLocation()
    const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')
    return (
        <Link
            to={to}
            className={`${CounsellorCSS.navLink} ${active ? CounsellorCSS.active : ''}`}
        >
            <i className={`${icon} ${CounsellorCSS.navIcon}`}></i>
            <span>{label}</span>
        </Link>
    )
}

export default function Counsellor() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user_id } = useSelector((store) => store.authentication)
    const { name, email } = useSelector((store) => store.counsellor)
    const { pathname } = useLocation()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const avatarLetter = (name || email || 'C').charAt(0).toUpperCase()
    const hasUnreadChat = useUnreadMessages(!!user_id)

    React.useEffect(() => {
        dispatch(getCounsellorData())
    }, [])

    React.useEffect(() => {
        const pusher = new Pusher('66a0704e45889e2fdd5a', { cluster: 'ap1' })
        const channel = pusher.subscribe('Career_Counselling_portal-development')
        channel.bind('demo', function (data) {
            // notification handling preserved but bell icon removed per requirements
        })
        return () => { pusher.unsubscribe('Career_Counselling_portal-development') }
    }, [user_id])

    const handleOpen = (e) => setAnchorEl(e.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handleLogout = async () => {
        handleClose()
        await dispatch(logout())
        navigate('/login')
    }

    return (
        <div className={CounsellorCSS.shell}>
            {/* Header */}
            <header className={CounsellorCSS.header}>
                <div className={CounsellorCSS.brand}>
                    <i className="fa-solid fa-book-open" style={{ marginRight: 8, fontSize: 18 }}></i>
                    <span>CareerGuidance</span>
                    <span className={CounsellorCSS.badge}>Counsellor</span>
                </div>
                <div className={CounsellorCSS.right}>
                    <Link to="/" className={CounsellorCSS.homeLink} title="Go to site">
                        <i className="fa fa-home"></i>
                    </Link>
                    <div style={{ position: 'relative', display: 'inline-flex' }}>
                        <button className={CounsellorCSS.avatarBtn} onClick={handleOpen} aria-label="User menu">
                            {avatarLetter}
                        </button>
                        {hasUnreadChat && (
                            <span style={{
                                position: 'absolute', top: 0, right: 0,
                                width: 9, height: 9, borderRadius: '50%',
                                background: '#e53935', border: '2px solid #4a148c',
                                pointerEvents: 'none',
                            }} />
                        )}
                    </div>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{ style: { minWidth: 160, borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } }}
                    >
                        <MenuItem
                            onClick={() => { handleClose(); navigate('/counsellor/profile') }}
                            style={{ fontFamily: 'var(--fontHeading)', fontSize: 14, gap: 10 }}
                        >
                            <i className="fa-solid fa-user" style={{ color: '#7b1fa2', width: 16 }}></i>
                            Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={handleLogout}
                            style={{ fontFamily: 'var(--fontHeading)', fontSize: 14, color: '#c62828', gap: 10 }}
                        >
                            <i className="fa-solid fa-right-from-bracket" style={{ width: 16 }}></i>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </header>

            {/* Body: sidebar + content */}
            <div className={CounsellorCSS.body}>
                <aside className={CounsellorCSS.sidebar}>
                    <nav className={CounsellorCSS.nav}>
                        {NAV_ITEMS.map(item => (
                            <NavLink key={item.to} {...item} exact={item.to === '/counsellor'} />
                        ))}
                        <div style={{ position: 'relative' }}>
                            <NavLink {...CHAT_ITEM} />
                            {hasUnreadChat && (
                                <span style={{
                                    position: 'absolute', top: 10, right: 12,
                                    width: 9, height: 9, borderRadius: '50%',
                                    background: '#e53935', border: '2px solid #4a148c',
                                    pointerEvents: 'none',
                                }} />
                            )}
                        </div>
                    </nav>
                </aside>
                <main className={CounsellorCSS.content}>
                    <Outlet />
                </main>
            </div>
            {location.pathname !== '/counsellor/counsellorChat' && <FloatingChatBubble />}
        </div>
    )
}
