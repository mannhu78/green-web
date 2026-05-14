import { useState, useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import "../css/Home.css"
import Header from "../components/Header"
import Footer from "../components/Footer"

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts"

function Home() {

    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)

    const reportRef = useRef()

    const user = JSON.parse(
        localStorage.getItem("user")
    )


    const handleAnalyze = async () => {

        if (!url) return

        setLoading(true)
        setProgress(0)
        setResult(null)

        let fakeProgress = 0

        const interval = setInterval(() => {

            fakeProgress += 5

            if (fakeProgress <= 90) {
                setProgress(fakeProgress)
            }

        }, 1000)

        try {

            const response = await fetch(
                "http://localhost:5000/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        url,

                        user_email:
                            user?.email || null
                    })
                }
            )

            const data = await response.json()

            console.log(data)

            clearInterval(interval)

            setProgress(100)

            setResult(data)

        } catch (err) {

            console.error(err)

            alert("Analyze failed")

        } finally {

            setTimeout(() => {

                setLoading(false)
                setProgress(0)

            }, 500)
        }

       
    }

    const handleExportPDF = async () => {

        window.scrollTo(0, 0)

        const element = reportRef.current

        if (!element) return

        const canvas = await html2canvas(
            element,
            {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#020617",
                scrollY: -window.scrollY
            }
        )

        const imgData =
            canvas.toDataURL("image/png")

        const pdf = new jsPDF(
            "p",
            "mm",
            "a4"
        )

        const pdfWidth =
            pdf.internal.pageSize.getWidth()

        const pdfHeight =
            (canvas.height * pdfWidth)
            / canvas.width

        let heightLeft = pdfHeight

        let position = 0

        pdf.addImage(
            imgData,
            "PNG",
            0,
            position,
            pdfWidth,
            pdfHeight
        )

        heightLeft -=
            pdf.internal.pageSize.getHeight()

        while (heightLeft > 0) {

            position =
                heightLeft - pdfHeight

            pdf.addPage()

            pdf.addImage(
                imgData,
                "PNG",
                0,
                position,
                pdfWidth,
                pdfHeight
            )

            heightLeft -=
                pdf.internal.pageSize.getHeight()
        }

        pdf.save(
            "green-web-report.pdf"
        )
    }

   
    const resourceData = result ? [
        {
            name: "Images",
            value: result.image_bytes
        },
        {
            name: "JavaScript",
            value: result.js_bytes
        },
        {
            name: "CSS",
            value: result.css_bytes
        },
        {
            name: "Fonts",
            value: result.font_bytes
        },
        {
            name: "Video",
            value: result.video_bytes
        }
    ] : []

    const performanceData = result ? [
        {
            name: "LCP",
            value: result.lcp
        },
        {
            name: "FCP",
            value: result.fcp
        },
        {
            name: "TBT",
            value: result.tbt
        },
        {
            name: "CLS",
            value: result.cls * 1000
        }
    ] : []

    const COLORS = [
        "#22c55e", // green
        "#3b82f6", // blue
        "#f59e0b", // amber
        "#ef4444", // red
        "#a855f7"  // purple
    ]   

    const screenshotUrl = result?.screenshot

    return (
        <>
        <Header/>

        <div className="home-container">

            <h1 className="title">
                    Website xanh, Trái đất lành
            </h1>

            <div className="analyze-box">

                <input
                    type="text"
                    placeholder="Enter website URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="url-input"
                />

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="analyze-btn"
                >
                    {
                        loading
                            ? "Analyzing..."
                            : "Analyze Website"
                    }
                </button>

            </div>

            {
                loading && (

                    <div className="progress-wrapper">

                        <div className="progress-track">

                            <div
                                className="progress-bar"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                        <p>
                            Running Lighthouse Audit...
                            {progress}%
                        </p>

                    </div>
                )
            }

                {
                    result && (

                        <div ref={reportRef}>

                            <div className="result-card">

                                <h2>
                                    Điểm hiệu suất:
                                    {result.performance_score}
                                </h2>

                                <h3>
                                    CO₂:
                                    {result.co2} g
                                </h3>

                                <h3>
                                    Label:
                                    {result.green_label}
                                </h3>

                            </div>

                            {
                                result?.green_host && (

                                    <div className="green-host-card">

                                        <h2>
                                            Hosting thân thiện môi trường
                                        </h2>

                                        <div className="host-status">

                                            {
                                                result.green_host?.green ? (
                                                    <span className="green-status">
                                                        🌱 Hosting xanh
                                                    </span>
                                                ) : (
                                                    <span className="red-status">
                                                        ⚠ Chưa xác minh xanh
                                                    </span>
                                                )
                                            }

                                        </div>

                                        <p>
                                            Nhà cung cấp hosting:
                                            <strong>
                                                {
                                                    result.green_host?.hosted_by || " Không xác định"
                                                }
                                            </strong>
                                        </p>

                                    </div>
                                )
                            }

                            {
                                screenshotUrl && (

                                    <div className="preview-card">

                                        <h2>
                                            Website Preview
                                        </h2>

                                        <img
                                            src={screenshotUrl}
                                            alt="Website Preview"
                                            className="website-preview"
                                            onError={(e) => {

                                                e.target.src =
                                                    "https://placehold.co/1200x700/020617/22c55e?text=Preview+Unavailable"
                                            }}
                                        />

                                    </div>
                                )
                            }

                            {
                                result?.equivalent && (

                                    <div className="eco-card">

                                        <h2>
                                            Chỉ số Carbon
                                        </h2>

                                        <p>
                                            ≈ {result.equivalent.phone_charges}
                                            lần sạc điện thoại
                                        </p>

                                        <p>
                                            ≈ {result.equivalent.led_hours}
                                            giờ thắp sáng bóng đèn LED
                                        </p>

                                    </div>
                                )
                            }

                            {
                                result?.eco_mode && (

                                    <div className="eco-mode-card">

                                        <h2>
                                            Mô phỏng chế độ tiết kiệm
                                        </h2>

                                        <p>
                                            Lượng CO₂ sau tối ưu:
                                            {result.eco_mode.optimized_co2} g
                                        </p>

                                        <p>
                                            Tiết kiệm được:
                                            {result.eco_mode.saved_co2} g
                                        </p>

                                        <p>
                                            Mức độ cải thiện:
                                            {result.eco_mode.green_improvement}%
                                        </p>

                                    </div>
                                )
                            }

                            {
                                result?.green_badge && (

                                    <div className="green-badge">
                                        🌱 Chứng nhận Website Xanh
                                    </div>
                                )
                            }

                            <div className="dashboard-grid">

                                {/* ========================= */}
                                {/* Resource Distribution */}
                                {/* ========================= */}

                                <div className="chart-card">

                                    <h2>
                                        Phân bổ tài nguyên
                                    </h2>

                                    <ResponsiveContainer
                                        width="100%"
                                        height={320}
                                    >

                                        <PieChart>

                                            <Pie
                                                data={resourceData}
                                                dataKey="value"
                                                outerRadius={110}
                                                innerRadius={45}
                                                paddingAngle={4}
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name} ${(percent * 100).toFixed(0)}%`
                                                }
                                            >

                                                {
                                                    resourceData.map(
                                                        (
                                                            entry,
                                                            index
                                                        ) => (

                                                            <Cell
                                                                key={index}
                                                                fill={
                                                                    COLORS[
                                                                    index % COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )
                                                }

                                            </Pie>

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#0f172a",
                                                    border: "1px solid #22c55e",
                                                    borderRadius: "12px",
                                                    color: "#fff"
                                                }}
                                            />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                                {/* ========================= */}
                                {/* Performance Metrics */}
                                {/* ========================= */}

                                <div className="chart-card">

                                    <h2>
                                        Nhóm chỉ số trải nghiệm người dùng
                                    </h2>

                                    <ResponsiveContainer
                                        width="99%"
                                        height={320}
                                    >

                                        <BarChart
                                            data={performanceData}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 0,
                                                bottom: 10
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#1e293b"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                tick={{
                                                    fill: "#cbd5e1",
                                                    fontSize: 13
                                                }}
                                                axisLine={{
                                                    stroke: "#334155"
                                                }}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                tick={{
                                                    fill: "#cbd5e1",
                                                    fontSize: 13
                                                }}
                                                axisLine={{
                                                    stroke: "#334155"
                                                }}
                                                tickLine={false}
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#0f172a",
                                                    border: "1px solid #22c55e",
                                                    borderRadius: "12px",
                                                    color: "#fff"
                                                }}
                                                cursor={{
                                                    fill: "rgba(34,197,94,0.08)"
                                                }}
                                            />

                                            <Bar
                                                dataKey="value"
                                                radius={[10, 10, 0, 0]}
                                                fill="#22c55e"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>
                                {/* ========================= */}
                                {/* Suggestions */}
                                {/* ========================= */}

                                <div className="suggestion-card">

                                    <h2 className="suggestion-title">
                                        Đề xuất tối ưu hoá
                                    </h2>

                                    <div className="suggestion-list">

                                        {
                                            result.suggestions?.length > 0 ? (

                                                result.suggestions.map(
                                                    (item, index) => (

                                                        <div
                                                            key={index}
                                                            className="suggestion-item"
                                                        >

                                                            <div className="suggestion-icon">
                                                                ⚡
                                                            </div>

                                                            <p>
                                                                {item}
                                                            </p>

                                                        </div>
                                                    )
                                                )

                                            ) : (

                                                <div className="good-result">

                                                    🌱 Website đã được tối ưu khá tốt

                                                </div>
                                            )
                                        }

                                    </div>

                                </div>

                            </div>

                        </div>
                    )
                }

                {
                    result && (

                        <button
                            onClick={handleExportPDF}
                            className="export-btn"
                        >

                            📄 Export PDF Report

                        </button>
                    )
                }
            </div>
    

            <Footer/>
        </>
    )
}

export default Home