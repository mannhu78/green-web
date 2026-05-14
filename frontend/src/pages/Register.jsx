import { useState } from "react"

import {
    Link,
    useNavigate
} from "react-router-dom"

import axios from "axios"

import "../css/Auth.css"

function Register() {

    const navigate = useNavigate()

    const [username, setUsername] =
        useState("")

    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const [loading, setLoading] =
        useState(false)

    const handleRegister = async () => {

        if (
            !username ||
            !email ||
            !password
        ) {

            alert(
                "Vui lòng nhập đầy đủ thông tin"
            )

            return
        }

        try {

            setLoading(true)

            await axios.post(
                "http://localhost:5000/register",
                {
                    username,
                    email,
                    password
                }
            )

            alert("Đăng ký thành công")

            navigate("/login")

        } catch (err) {

            console.log(err)

            alert(
                err.response?.data?.error ||
                "Đăng ký thất bại"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1 className="auth-title">
                    Tạo tài khoản
                </h1>

                {/* Username */}

                <input
                    type="text"
                    placeholder="Tên người dùng"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    className="auth-input"
                />

                {/* Email */}

                <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="auth-input"
                />

                {/* Password */}

                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="auth-input"
                />

                {/* Button */}

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="auth-btn"
                >

                    {
                        loading
                            ? "Đang tạo tài khoản..."
                            : "Đăng ký"
                    }

                </button>

                {/* Divider */}

                <div className="auth-divider">

                    <span>
                        Green Web Analyzer
                    </span>

                </div>

                {/* Links */}

                <div className="auth-links">

                    <span
                        style={{
                            color: "#94a3b8"
                        }}
                    >
                        Đã có tài khoản?
                    </span>

                    <Link to="/login">
                        Đăng nhập
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default Register