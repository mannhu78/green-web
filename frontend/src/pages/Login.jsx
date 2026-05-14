import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import {
    signInWithPopup
} from "firebase/auth"

import {
    auth,
    googleProvider
} from "../firebase/firebase"

import axios from "axios"

import "../css/Auth.css"

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)

    // =========================
    // Login thường
    // =========================

    const handleLogin = async () => {

        try {

            setLoading(true)

            const response = await axios.post(
                "http://localhost:5000/login",
                {
                    email,
                    password
                }
            )

            localStorage.setItem(
                "token",
                response.data.token
            )

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            )

            alert("Đăng nhập thành công")

            navigate("/")

        } catch (err) {

            console.log(err)

            alert(
                err.response?.data?.error ||
                "Đăng nhập thất bại"
            )

        } finally {

            setLoading(false)
        }
    }

    // =========================
    // Login Google
    // =========================

    const handleGoogleLogin =
        async () => {

            try {

                const result =
                    await signInWithPopup(
                        auth,
                        googleProvider
                    )

                const user = result.user

                // Gửi user về Flask backend

                const response = await axios.post(
                    "http://localhost:5000/google-login",
                    {
                        name: user.displayName,
                        email: user.email,
                        avatar: user.photoURL,
                        google_id: user.uid
                    }
                )

                localStorage.setItem(
                    "token",
                    response.data.token
                )

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                )

                alert("Đăng nhập Google thành công")

                navigate("/")

            } catch (err) {

                console.log(err)

                alert("Google Login thất bại")
            }
        }

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1 className="auth-title">
                    Đăng nhập
                </h1>

                {/* ========================= */}
                {/* Email */}
                {/* ========================= */}

                <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="auth-input"
                />

                {/* ========================= */}
                {/* Password */}
                {/* ========================= */}

                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="auth-input"
                />

                {/* ========================= */}
                {/* Login Button */}
                {/* ========================= */}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="auth-btn"
                >

                    {
                        loading
                            ? "Đang đăng nhập..."
                            : "Đăng nhập"
                    }

                </button>

                {/* ========================= */}
                {/* Divider */}
                {/* ========================= */}

                <div className="auth-divider">

                    <span>
                        hoặc
                    </span>

                </div>

                {/* ========================= */}
                {/* Google Login */}
                {/* ========================= */}

                <button
                    onClick={handleGoogleLogin}
                    className="google-btn"
                >

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                        alt="Google"
                    />

                    <span>
                        Tiếp tục với Google
                    </span>

                </button>

                {/* ========================= */}
                {/* Links */}
                {/* ========================= */}

                <div className="auth-links">

                    <Link to="/forgot-password">
                        Quên mật khẩu?
                    </Link>

                    <Link to="/register">
                        Tạo tài khoản
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default Login