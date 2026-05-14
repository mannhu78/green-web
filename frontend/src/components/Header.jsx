import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import "../css/Header.css"

function Header() {

    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const user = JSON.parse(
        localStorage.getItem("user")
    )

    const handleLogout = () => {

        localStorage.removeItem("token")

        localStorage.removeItem("user")

        navigate("/login")
    }

    return (

        <header className="gw-header">

            <div className="gw-header-container">

                {/* Logo */}

                <Link
                    to="/"
                    className="gw-logo"
                >
                    🌱 Green Web
                </Link>

                {/* Desktop Menu */}

                <nav className="gw-nav">

                    <Link
                        to="/"
                        className="gw-nav-link"
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className="gw-nav-link"
                    >
                        About
                    </Link>

                    <Link
                        to="/compare"
                        className="gw-nav-link"
                    >
                        Compare
                    </Link>

                    {
                        !user ? (

                            <>

                                <Link
                                    to="/login"
                                    className="gw-nav-link"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="gw-register-btn"
                                >
                                    Register
                                </Link>

                            </>

                        ) : (

                            <div className="gw-user-menu">

                                {
                                    user.avatar && (

                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="gw-avatar"
                                        />
                                    )
                                }

                                <span className="gw-username">

                                    {user.username}

                                </span>

                                <Link
                                    to="/history"
                                    className="gw-nav-link"
                                >
                                    History
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="gw-logout-btn"
                                >
                                    Logout
                                </button>

                            </div>
                        )
                    }

                </nav>

                {/* Mobile Button */}

                <button
                    className="gw-menu-btn"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

            </div>

            {/* Mobile Menu */}

            {
                open && (

                    <div className="gw-mobile-menu">

                        <Link
                            to="/"
                            className="gw-mobile-link"
                            onClick={() => setOpen(false)}
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            className="gw-mobile-link"
                            onClick={() => setOpen(false)}
                        >
                            About
                        </Link>

                        <Link
                            to="/compare"
                            className="gw-mobile-link"
                            onClick={() => setOpen(false)}
                        >
                            Compare
                        </Link>

                        {
                            !user ? (

                                <>

                                    <Link
                                        to="/login"
                                        className="gw-mobile-link"
                                        onClick={() => setOpen(false)}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="gw-mobile-link"
                                        onClick={() => setOpen(false)}
                                    >
                                        Register
                                    </Link>

                                </>

                            ) : (

                                <>

                                    <div className="gw-mobile-user">

                                        👤 {user.username}

                                    </div>

                                    <Link
                                        to="/history"
                                        className="gw-mobile-link"
                                        onClick={() => setOpen(false)}
                                    >
                                        History
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="gw-mobile-logout"
                                    >
                                        Logout
                                    </button>

                                </>
                            )
                        }

                    </div>
                )
            }

        </header>
    )
}

export default Header