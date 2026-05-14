import { useState } from "react"
import { Link } from "react-router-dom"

import axios from "axios"

import "../css/Auth.css"

function ForgotPassword() {

    const [email, setEmail] = useState("")

    const [loading, setLoading] = useState(false)

    const [message, setMessage] = useState("")

    // =========================
    // Handle Forgot Password
    // =========================

    const handleForgotPassword =
        async () => {

            if (!email) {

                alert("Vui lòng nhập email")

                return
            }

            try {

                setLoading(true)

                setMessage("")

                const response = await axios.post(
                    "http://localhost:5000/forgot-password",
                    {
                        email
                    }
                )

                setMessage(
                    response.data.message
                )

            } catch (err) {

                console.log(err)

                alert(
                    err.response?.data?.error ||
                    "Không thể gửi email"
                )

            } finally {

                setLoading(false)
            }
        }

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1 className="auth-title">
                    Quên mật khẩu
                </h1>

                <p className="auth-subtitle">

                    Nhập email để nhận liên kết đặt lại mật khẩu

                </p>

                {/* ========================= */}
                {/* Email Input */}
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
                {/* Submit Button */}
                {/* ========================= */}

                <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="auth-btn"
                >

                    {
                        loading
                            ? "Đang gửi..."
                            : "Gửi email khôi phục"
                    }

                </button>

                {/* ========================= */}
                {/* Success Message */}
                {/* ========================= */}

                {
                    message && (

                        <div className="success-message">

                            {message}

                        </div>
                    )
                }

                {/* ========================= */}
                {/* Back Login */}
                {/* ========================= */}

                <div className="auth-links">

                    <Link to="/login">

                        Quay lại đăng nhập

                    </Link>

                </div>

            </div>

        </div>
    )
}

export default ForgotPassword