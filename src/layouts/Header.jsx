import HeaderCSS from "../assets/styles/Header.module.css"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { handleModelChange, resetCount, ErrorMsg } from "../features/offerCounselling/offerCounsellingSlice"
import { setNotificationData } from "../features/header/headerSlice"
import { logout, authenticate } from "../features/authentication/authenticationSlice"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Pusher from "pusher-js"

export default function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { notificationData } = useSelector((store) => store.header)
    const [notification, setNotification] = React.useState(null)
    const [profileMenu, setProfileMenu] = React.useState(null)
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [darkMode, setDarkMode] = React.useState(() => {
        return localStorage.getItem('theme') === 'dark'
    })

    React.useEffect(() => {
        const theme = darkMode ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [darkMode])
    const notificationOpen = Boolean(notification)
    const profileMenuOpen = Boolean(profileMenu)
    const { user_id, is_exist, role, name, email, counsellor_approved } = useSelector((store) => store.authentication)

    // Sync auth state so header updates immediately after login/logout
    React.useEffect(() => {
        dispatch(authenticate())
    }, [dispatch])

    const handleNotification = (event) => setNotification(event.currentTarget)
    const handleNotificationClose = () => setNotification(null)

    const handleProfileMenuOpen = (event) => setProfileMenu(event.currentTarget)
    const handleProfileMenuClose = () => setProfileMenu(null)

    const pusher = new Pusher('66a0704e45889e2fdd5a', { cluster: 'ap1' })
    const channel = pusher.subscribe('Career_Counselling_portal-development')
    channel.bind('demo', function (data) {
        const filteredMessages = data.message.filter((e) => user_id == e.receiver_id)
        const sortedNotifications = filteredMessages.sort((a, b) => new Date(b.last_message_created_at) - new Date(a.last_message_created_at))
        dispatch(setNotificationData({ data: sortedNotifications.length > 0 ? sortedNotifications : [] }))
    })

    const handleLogout = async () => {
        setMenuOpen(false)
        handleProfileMenuClose()
        await dispatch(logout())
        navigate('/')
    }

    const isCounsellor = role === 'C' || (role === 'B' && counsellor_approved)
    const isPendingCounsellor = role === 'B' && !counsellor_approved
    const dashboardPath = role === 'A' ? '/admin/dashboard' : '/counsellor'
    // Use name for avatar; fall back to email initial, then 'U'
    const avatarLetter = (name || email || 'U').charAt(0).toUpperCase()

    return (
        <header className={HeaderCSS.header}>
            <nav className={`${HeaderCSS.navigation} navbar navbar-expand-lg`}>
                <div className="container-fluid">
                    {/* Logo */}
                    <Link className={`${HeaderCSS.navbarBrand} navbar-brand`} to="/">
                        <div className={HeaderCSS.logoWrap}>
                            <i className={`fa-solid fa-book-open ${HeaderCSS.logoIcon}`}></i>
                            <span className={HeaderCSS.logoHeading}>CareerGuidance</span>
                        </div>
                    </Link>

                    {/* Mobile toggle */}
                    <button
                        className={`${HeaderCSS.navbbarToggler} navbar-toggler`}
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Nav links */}
                    <div className={`${HeaderCSS.navbarCollapse} ${menuOpen ? HeaderCSS.menuOpen : ''} navbar-collapse`}>
                        <ul className={`${HeaderCSS.navbarNav} navbar-nav ms-auto d-flex align-items-center`}>
                            <li className={`${HeaderCSS.navItem} nav-item`}>
                                <Link to="/" className={`${HeaderCSS.navLink} nav-link`} onClick={() => setMenuOpen(false)}>Home</Link>
                            </li>
                            {/* Counsellors directory — visible to everyone */}
                            <li className={`${HeaderCSS.navItem} nav-item`}>
                                <Link to="/askCounsellor" className={`${HeaderCSS.navLink} nav-link`} onClick={() => setMenuOpen(false)}>Counsellors</Link>
                            </li>
                            {/* Offer Counselling — hidden for verified counsellors and pending applicants */}
                            {!isCounsellor && !isPendingCounsellor && (
                                <li className={`${HeaderCSS.navItem} nav-item`}>
                                    <Link to="/OfferCounselling" className={`${HeaderCSS.navLink} nav-link`}
                                        onClick={() => {
                                            setMenuOpen(false)
                                            dispatch(handleModelChange())
                                            dispatch(resetCount())
                                            dispatch(ErrorMsg({ msg: '' }))
                                        }}>Offer Counselling</Link>
                                </li>
                            )}
                            <li className={`${HeaderCSS.navItem} nav-item`}>
                                <Link to="/blogs" className={`${HeaderCSS.navLink} nav-link`} onClick={() => setMenuOpen(false)}>Blogs</Link>
                            </li>
                            <li className={`${HeaderCSS.navItem} nav-item`}>
                                <Link to="/about" className={`${HeaderCSS.navLink} nav-link`} onClick={() => setMenuOpen(false)}>About Us</Link>
                            </li>

                            {/* Dashboard — counsellors and admin only */}
                            {is_exist && (isCounsellor || role === 'A') && (
                                <li className={`${HeaderCSS.navItem} nav-item`}>
                                    <Link to={dashboardPath} className={`${HeaderCSS.dashboardBtn} nav-link`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                                </li>
                            )}

                            {/* Login button — guests only */}
                            {!is_exist && (
                                <li className={`${HeaderCSS.navItem} nav-item`}>
                                    <Link to="/login" className={`${HeaderCSS.loginBtn} nav-link`} onClick={() => setMenuOpen(false)}>Login</Link>
                                </li>
                            )}

                            {/* Avatar dropdown — logged-in users */}
                            {is_exist && (
                                <li className="nav-item" style={{ display: 'flex', alignItems: 'center', margin: '0 4px' }}>
                                    <button
                                        className={HeaderCSS.avatarBtn}
                                        onClick={handleProfileMenuOpen}
                                        aria-controls={profileMenuOpen ? 'profile-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={profileMenuOpen ? 'true' : undefined}
                                        aria-label="User menu"
                                    >
                                        {avatarLetter}
                                    </button>
                                    <Menu
                                        id="profile-menu"
                                        anchorEl={profileMenu}
                                        open={profileMenuOpen}
                                        onClose={handleProfileMenuClose}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        PaperProps={{
                                            style: {
                                                minWidth: 160,
                                                borderRadius: 10,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => { handleProfileMenuClose(); setMenuOpen(false); navigate('/profile') }}
                                            style={{ fontFamily: "var(--fontHeading)", fontSize: 14, gap: 10 }}
                                        >
                                            <i className="fa-solid fa-user" style={{ color: '#3949ab', width: 16 }}></i>
                                            Profile
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem
                                            onClick={handleLogout}
                                            style={{ fontFamily: "var(--fontHeading)", fontSize: 14, color: '#c62828', gap: 10 }}
                                        >
                                            <i className="fa-solid fa-right-from-bracket" style={{ width: 16 }}></i>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </li>
                            )}

                            {/* Dark mode toggle */}
                            <li className="nav-item" style={{ display: 'flex', alignItems: 'center' }}>
                                <button
                                    onClick={() => setDarkMode(d => !d)}
                                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 18, color: darkMode ? '#fdd835' : '#1a237e',
                                        padding: '4px 8px', borderRadius: 6,
                                        transition: 'color 0.2s'
                                    }}
                                    aria-label="Toggle dark mode"
                                >
                                    <i className={darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
                                </button>
                            </li>

                            {/* Bell / notifications — logged-in users only */}
                            {is_exist && (
                                <li className="nav-item">
                                    <Link
                                        className={HeaderCSS.links}
                                        id="notification-button"
                                        aria-controls={notificationOpen ? 'notification-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={notificationOpen ? 'true' : undefined}
                                        onClick={handleNotification}
                                    >
                                        {notificationData && notificationData.length > 0 && notificationData[0].total_unread_message_count > 0 && (
                                            <span className={HeaderCSS.notificationCount}>
                                                {notificationData[0].total_unread_message_count}
                                            </span>
                                        )}
                                        <span><i className={`${HeaderCSS.bellIcon} fa-solid fa-bell`}></i></span>
                                    </Link>
                                    <Menu
                                        id="notification-menu"
                                        aria-labelledby="notification-button"
                                        anchorEl={notification}
                                        open={notificationOpen}
                                        onClose={handleNotificationClose}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        PaperProps={{ style: { width: "300px", backgroundColor: "var(--lightPink)" } }}
                                    >
                                        {notificationData && notificationData.length > 0 ? (
                                            notificationData.map((item, index) => ([
                                                <MenuItem key={`menu-item-${index}`} style={{ whiteSpace: 'normal', fontFamily: "var(--fontHeading)" }}>
                                                    You may have {item.channel_unread_message_count} unread message from {item.sender_name} and message is {item.last_message}
                                                </MenuItem>,
                                                index < notificationData.length - 1 && <hr key={`divider-${index}`} />,
                                            ]))
                                        ) : (
                                            <MenuItem style={{ whiteSpace: 'normal', fontFamily: "var(--fontHeading)", color: '#888', fontSize: 14 }}>
                                                No new notifications
                                            </MenuItem>
                                        )}
                                    </Menu>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}
