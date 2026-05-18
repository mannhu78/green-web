import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../css/History.css"

function History() {

    const [histories, setHistories] =
        useState([])

    const [filteredHistories,
        setFilteredHistories] =
        useState([])

    const [selectedDate,
        setSelectedDate] =
        useState("")

    const user = JSON.parse(
        localStorage.getItem("user")
    )

    useEffect(() => {

        fetchHistory()

    }, [])

    // =========================
    // Fetch History
    // =========================

    const fetchHistory = async () => {

        try {

            const response =
                await axios.get(

                    `http://localhost:5000/history/${user.email}`
                )

            setHistories(response.data)

            setFilteredHistories(
                response.data
            )

        } catch (err) {

            console.log(err)
        }
    }

    // =========================
    // Filter By Date
    // =========================
    const handleFilterDate = (date) => {

        setSelectedDate(date)

        if (!date) {

            setFilteredHistories(histories)

            return
        }

        const filtered = histories.filter(
            (item) => {

                if (!item.created_at)
                    return false

                const itemDate = new Date(
                    item.created_at
                )

                const formattedDate =
                    itemDate.getFullYear() +
                    "-" +
                    String(
                        itemDate.getMonth() + 1
                    ).padStart(2, "0") +
                    "-" +
                    String(
                        itemDate.getDate()
                    ).padStart(2, "0")

                return formattedDate === date
            }
        )

        setFilteredHistories(filtered)
    }

    const labelMap = {
        green: "🌱 Website xanh",
        moderate: "⚡ Phát thải trung bình",
        heavy: "🔥 Phát thải carbon cao",
        error: "❌ Phân tích thất bại"
    }
    return (
        <>
        <Header/>
        

        <div className="history-page">

            <div className="history-header">

                <h1>
                    Lịch sử phân tích
                </h1>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                        handleFilterDate(
                            e.target.value
                        )
                    }
                    className="history-date-filter"
                />

            </div>

                <div className="history-grid">

                    {
                        filteredHistories.length > 0 ? (

                            filteredHistories.map((item) => (

                                <div
                                    key={item.id}
                                    className="history-card"
                                >

                                    <h3>
                                        {item.url}
                                    </h3>

                                    <p>
                                        ⚡ Điểm hiệu suất:
                                        <strong> {item.performance_score}</strong>
                                    </p>

                                    <p>
                                        🌱 CO₂:
                                        <strong> {item.co2} g</strong>
                                    </p>

                                    <p>
                                        📊 Kết quả phân tích:
                                        <strong>
                                            {labelMap[item.green_label] || item.green_label}
                                        </strong>
                                    </p>
                                    <p>
                                        📅 {
                                            new Date(
                                                item.created_at
                                            ).toLocaleString("vi-VN")
                                        }
                                    </p>

                                </div>
                            ))

                        ) : (

                            <div className="empty-history">

                                📭 Chưa có lịch sử phân tích cho ngày này

                            </div>
                        )
                    }

                </div>

            </div>
           <Footer/> 
        </>
    )
}

export default History