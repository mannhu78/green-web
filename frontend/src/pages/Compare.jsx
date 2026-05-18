import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../css/Compare.css"

function Compare() {

    const [url1, setUrl1] = useState("")
    const [url2, setUrl2] = useState("")

    const [result1, setResult1] = useState(null)
    const [result2, setResult2] = useState(null)

    const [loading, setLoading] = useState(false)

    const [progress, setProgress] = useState(0)

    const analyzeWebsite = async (url) => {

        const response = await fetch(
            "http://localhost:5000/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            }
        )

        return await response.json()
    }

    const handleCompare = async () => {

        if (!url1 || !url2) return

        setLoading(true)

        setProgress(10)

        try {

            const data1 = await analyzeWebsite(url1)

            setProgress(55)

            const data2 = await analyzeWebsite(url2)

            setProgress(100)

            setResult1(data1)

            setResult2(data2)


        } catch (err) {

            console.error(err)

            alert("So sánh thất bại")

        } finally {

            setTimeout(() => {

                setLoading(false)

                setProgress(0)

            }, 800)
        }
    }


    let winner = null

    if (
        result1?.green_score !== undefined &&
        result2?.green_score !== undefined
    ) {

        winner =
            (result1?.green_score || 0) >
                (result2?.green_score || 0)

                ? result1
                : result2
    }

    const greenerSite =
        (result1?.green_score || 0) >
            (result2?.green_score || 0)
            ? result1
            : result2
    
    return (
        <>
            <Header />

            <div className="compare-container">

                <div className="compare-hero">

                    <h1 className="compare-title">
                        So sánh hiệu suất Website
                    </h1>

                    <p className="compare-subtitle">
                        Phân tích tốc độ, lượng phát thải CO₂
                        và mức độ thân thiện môi trường giữa hai website
                    </p>

                </div>

                <div className="compare-inputs">

                    <input
                        type="text"
                        placeholder="Website A"
                        value={url1}
                        onChange={(e) =>
                            setUrl1(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Website B"
                        value={url2}
                        onChange={(e) =>
                            setUrl2(e.target.value)
                        }
                    />

                    <button onClick={handleCompare}>
                        {
                            loading
                                ? "Đang so sánh..."
                                : "So sánh"
                        }
                    </button>

                </div>

                {
                    loading && (

                        <div className="compare-progress-wrapper">

                            <div className="compare-progress-track">

                                <div
                                    className="compare-progress-bar"
                                    style={{
                                        width: `${progress}%`
                                    }}
                                />

                            </div>

                            <p>
                                So sánh websites...
                                {progress}%
                            </p>

                        </div>
                    )
                }

                {
                    result1 && result2 && (

                        <div className="compare-grid">

                            {/* Website 1 */}
                            <div
                                className={
                                    winner?.url === result1?.url
                                        ? "compare-card winner"
                                        : "compare-card"
                                }
                            >

                                <div className="compare-card-header">

                                    <h2>{result1?.url}</h2>

                                    {
                                        winner?.url === result1?.url && (
                                            <span className="winner-badge">
                                                🏆 Tốt hơn
                                            </span>
                                        )
                                    }

                                </div>

                                <div className="metric-list">

                                    <div className="metric-item">
                                        <span>Điểm hiệu suất</span>
                                        <strong>
                                            {result1?.performance_score || "N/A"}
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>CO₂</span>
                                        <strong>
                                            {result1?.co2} g
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>LCP</span>
                                        <strong>
                                            {result1?.lcp}
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>Số request</span>
                                        <strong>
                                            {result1?.request_count}
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>Green Score</span>
                                        <strong>
                                            {result1?.green_score}%
                                        </strong>
                                    </div>

                                    <div
                                        className={
                                            result1?.green_score >= 70
                                                ? "eco-badge green"
                                                : result1?.green_score >= 40
                                                    ? "eco-badge medium"
                                                    : "eco-badge red"
                                        }
                                    >

                                        {
                                            result1?.green_score >= 70
                                                ? "🌱 Website xanh"
                                                : result1?.green_score >= 40
                                                    ? "⚡ Mức phát thải trung bình"
                                                    : "🔥 Phát thải carbon cao"
                                        }

                                    </div>

                                    <div className="metric-item">
                                        <span>AI Dự đoán</span>

                                        <strong>
                                            {
                                                result1?.green_label === "green"
                                                    ? "🌱 Website xanh"
                                                    : "🔥 Website phát thải carbon cao"
                                            }
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>Độ tin cậy AI</span>

                                        <strong>
                                            {(
                                                (result1?.probability || 0) * 100
                                            ).toFixed(1)}%
                                        </strong>
                                    </div>

                                </div>

                                {
                                    result1?.error && (
                                        <div className="compare-error">
                                            {result1?.error}
                                        </div>
                                    )
                                }

                            </div>

                            {/* Website 2 */}
                            <div
                                className={
                                    winner?.url === result2?.url
                                        ? "compare-card winner"
                                        : "compare-card"
                                }
                            >

                                <div className="compare-card-header">

                                    <h2>{result2?.url}</h2>

                                    {
                                        winner?.url === result2?.url && (
                                            <span className="winner-badge">
                                                🏆 Tốt hơn
                                            </span>
                                        )
                                    }

                                </div>

                                <div className="metric-list">

                                    <div className="metric-item">
                                        <span>Điểm hiệu suất</span>
                                        <strong>
                                            {result2?.performance_score}
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>CO₂</span>
                                        <strong>
                                            {result2?.co2} g
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>LCP</span>
                                        <strong>
                                            {result2?.lcp}
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>Số request</span>
                                        <strong>
                                            {result2?.request_count}
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>Green Score</span>
                                        <strong>
                                            {result2?.green_score}%
                                        </strong>
                                    </div>

                                    <div
                                        className={
                                            result2?.green_score >= 70
                                                ? "eco-badge green"
                                                : result2?.green_score >= 40
                                                    ? "eco-badge medium"
                                                    : "eco-badge red"
                                        }
                                    >

                                        {
                                            result2?.green_score >= 70
                                                ? "🌱 Website xanh"
                                                : result2?.green_score >= 40
                                                    ? "⚡ Mức phát thải trung bình"
                                                    : "🔥 Phát thải carbon cao"
                                        }

                                    </div>

                                    <div className="metric-item">
                                        <span>AI Dự đoán</span>

                                        <strong>
                                            {
                                                result2?.green_label === "green"
                                                    ? "🌱 Website xanh"
                                                    : "🔥 Website phát thải carbon cao"
                                            }
                                        </strong>
                                    </div>

                                    <div className="metric-item">
                                        <span>Độ tin cậy AI</span>

                                        <strong>
                                            {(
                                                (result2?.probability || 0) * 100
                                            ).toFixed(1)}%
                                        </strong>
                                    </div>

                                </div>

                                {
                                    result2?.error && (

                                        <div className="compare-error">

                                            {result2?.error}

                                        </div>
                                    )
                                }

                            </div>

                        </div>

                        
                    )

                }

                {
                    winner && (

                        <div className="winner-summary">

                            <div className="winner-icon">
                                🏆
                            </div>

                            <div>

                                <h2>
                                    Website tối ưu hơn
                                </h2>

                                <p>
                                    {winner?.url}
                                </p>

                            </div>

                        </div>
                    )
                }

                {
                    result1 &&
                    result2 && (

                        <div className="compare-ai-summary">

                            <h2>
                               Phân tích từ AI
                            </h2>

                            <p>

                                <strong>
                                    {greenerSite?.url} có :
                                </strong>


                                <br />
                                • Green Score cao hơn
                                <br />
                                • Lượng phát thải CO₂ thấp hơn
                                <br />
                                • Tối ưu tài nguyên tốt hơn
                                <br />
                                • Được AI đánh giá thân thiện môi trường hơn

                            </p>

                            <div className="compare-score-section">

                                <div className="score-label">
                                    <span>{result1?.url}</span>
                                    <span>{result1?.green_score}%</span>
                                </div>

                                <div className="score-bar-wrapper">

                                    <div
                                        className="score-bar green"
                                        style={{
                                            width: `${result1?.green_score || 0}%`
                                        }}
                                    />

                                </div>

                                <div className="score-label">
                                    <span>{result2?.url}</span>
                                    <span>{result2?.green_score}%</span>
                                </div>

                                <div className="score-bar-wrapper">

                                    <div
                                        className="score-bar blue"
                                        style={{
                                            width: `${result2?.green_score || 0}%`
                                        }}
                                    />

                                </div>

                            </div>

                        </div>
                    )
                }
            </div>

            <Footer />
        </>
    )
}

export default Compare