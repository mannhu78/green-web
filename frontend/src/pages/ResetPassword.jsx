import { useParams, useNavigate } from "react-router-dom"

import { useState } from "react"

import axios from "axios"

import "../css/Auth.css"

function ResetPassword() {

    const { token } = useParams()

    const navigate = useNavigate()

    const [password, setPassword] =
        useState("")

    const [confirmPassword,
        setConfirmPassword] =
        useState("")

    const [loading, setLoading] =
        useState(false)

    const handleReset = async () => {

        if (
            !password ||
            !confirmPassword
        ) {

            alert(
                "Vui lòng nhập đầy đủ thông tin"
            )

            return
        }

        if (
            password !== confirmPassword
        ) {

            alert(
                "Mật khẩu xác nhận không khớp"
            )

            return
        }

        try {

            setLoading(true)

            await axios.post(
                "http://localhost:5000/reset-password",
                {
                    token,
                    password
                }
            )

            alert(
                "Đổi mật khẩu thành công"
            )

            navigate("/login")

        } catch (err) {

            console.log(err)

            alert(
                err.response?.data?.error ||
                "Token không hợp lệ"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1 className="auth-title">

                    Đặt lại mật khẩu

                </h1>

                {/* Password */}

                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="auth-input"
                />

                {/* Confirm Password */}

                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                    className="auth-input"
                />

                {/* Button */}

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="auth-btn"
                >

                    {
                        loading
                            ? "Đang cập nhật..."
                            : "Đổi mật khẩu"
                    }

                </button>

            </div>

        </div>
    )
}

export default ResetPassword