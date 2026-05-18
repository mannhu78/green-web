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

            // =========================
            // Analyze API
            // =========================

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

            console.log("ANALYZE:", data)

            // =========================
            // SHAP API
            // =========================

            const shapResponse = await fetch(
                "http://localhost:5000/shap",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        category:
                            data.category || "general",

                        page_type:
                            data.page_type || "desktop",

                        device:
                            data.device || "desktop",

                        request_count:
                            data.request_count || 0,

                        total_bytes:
                            data.total_bytes || 0,

                        image_bytes:
                            data.image_bytes || 0,

                        js_bytes:
                            data.js_bytes || 0,

                        css_bytes:
                            data.css_bytes || 0,

                        font_bytes:
                            data.font_bytes || 0,

                        video_bytes:
                            data.video_bytes || 0,

                        has_video:
                            data.has_video || 0,

                        image_count:
                            data.image_count || 0,

                        script_count:
                            data.script_count || 0,

                        third_party_requests:
                            data.third_party_requests || 0,

                        unused_js:
                            data.unused_js || 0,

                        unused_css:
                            data.unused_css || 0,

                        lcp:
                            data.lcp || 0,

                        fcp:
                            data.fcp || 0,

                        cls:
                            data.cls || 0,

                        tbt:
                            data.tbt || 0
                    })
                }
            )

            const shapData = await shapResponse.json()

            console.log("SHAP:", shapData)

            // =========================
            // Merge result
            // =========================

            data.shap = shapData

            clearInterval(interval)

            setProgress(100)

            setResult(data)

        } catch (err) {

            console.error(err)

            alert("Analyze failed")
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
            name: "Hình ảnh",
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
            label: "Tốc độ tải nội dung chính",
            value: Number(result.lcp || 0)
        },

        {
            name: "FCP",
            label: "Tốc độ hiển thị đầu tiên",
            value: Number(result.fcp || 0)
        },

        {
            name: "TBT",
            label: "Thời gian chặn luồng chính",
            value: Number(result.tbt || 0)
        },

        {
            name: "CLS",
            label: "Độ ổn định bố cục",
            value: Number(result.cls || 0) * 1000
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

    const featureLabels = {

        lcp: "Tốc độ tải nội dung chính",

        fcp: "Tốc độ hiển thị đầu tiên",

        tbt: "Thời gian chặn luồng chính",

        cls: "Độ ổn định bố cục",

        unused_js: "JavaScript dư thừa",

        unused_css: "CSS dư thừa",

        js_bytes: "Dung lượng JavaScript",

        css_bytes: "Dung lượng CSS",

        image_bytes: "Dung lượng hình ảnh",

        request_count: "Số lượng request",

        category: "Loại website",

        device: "Thiết bị",

        page_type: "Loại giao diện"
    }


    const CustomTooltip = ({ active, payload }) => {

        if (
            active &&
            payload &&
            payload.length
        ) {

            return (

                <div className="custom-tooltip">

                    <h4>
                        {payload[0].payload.label}
                    </h4>

                    <p>
                        Giá trị:
                        <strong>
                            {payload[0].value}
                        </strong>
                    </p>

                </div>
            )
        }

        return null
    }

    const getMetricColor = (name, value) => {

        if (name === "CLS") {

            return value > 250
                ? "#ef4444"
                : "#22c55e"
        }

        if (name === "TBT") {

            return value > 300
                ? "#f59e0b"
                : "#22c55e"
        }

        return "#22c55e"
    }

    const totalResourceSize =
        resourceData.reduce(
            (sum, item) => sum + item.value,
            0
        )

    const totalMB =
        (totalResourceSize / 1024 / 1024)
            .toFixed(2)
    
    const ResourceTooltip = ({
        active,
        payload
    }) => {

        if (
            active &&
            payload &&
            payload.length
        ) {

            const item = payload[0]

            return (

                <div className="custom-tooltip">

                    <h4>
                        {item.name}
                    </h4>

                    <p>
                        {
                            (
                                item.value /
                                1024 /
                                1024
                            ).toFixed(2)
                        } MB
                    </p>

                </div>
            )
        }

        return null
    }

    const heaviestResource =
        resourceData.reduce(
            (max, item) =>
                item.value > max.value
                    ? item
                    : max,
            resourceData[0]
        )
    
    return (
        <>
        <Header/>

        <div className="home-container">

            <h1 className="title">
                Website xanh, Trái đất lành
            </h1>
                
            <p className="hero-subtitle">
                Phân tích hiệu suất, lượng khí thải CO₂
                và mức độ thân thiện môi trường của website bằng AI
            </p>

            <div className="analyze-box">

                <input
                    type="text"
                    placeholder="Nhập URL website cần phân tích..."
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
                            ? "Đang phân tích..."
                            : "Phân tích website"
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
                            Đang chạy Lighthouse Audit và AI phân tích...
                            {progress}%
                        </p>

                    </div>
                )
            }

                {
                    result && (

                        <div ref={reportRef}>

                            <div className="result-card">

                                <div className="kpi-grid">

                                    <div className="kpi-card">
                                        <span>Điểm hiệu suất</span>
                                        <h2>{result.performance_score}</h2>
                                    </div>

                                    <div className="kpi-card">
                                        <span>CO₂</span>
                                        <h2>{result.co2} g</h2>
                                    </div>

                                    <div className="kpi-card">
                                        <span>Điểm số "Xanh"</span>
                                        <h2>{result.green_score}%</h2>
                                    </div>

                                    <div className="kpi-card">
                                        <span>Độ tin cậy AI</span>
                                        <h2>
                                            {(result.probability * 100).toFixed(1)}%
                                        </h2>
                                    </div>

                                </div>

                                {/* ========================= */}
                                {/* AI Prediction */}
                                {/* ========================= */}

                                <h3>
                                    Kết quả phân tích AI: 
                                    {
                                        result.green_label === "green"
                                            ? " 🌱 Website thân thiện môi trường"
                                            : " ⚠ Website phát thải carbon cao"
                                    }
                                </h3>

                                <h3>
                                    Điểm số "Xanh": {result.green_score}%
                                     
                                </h3>

                                <h3>
                                    Độ tin cậy AI: {(result.probability * 100).toFixed(2)}%
                                    
                                </h3>
                                {
                                    result?.shap?.top_features && (

                                        <div className="shap-card">

                                            <h2>
                                                Đánh giá chi tiết (SHAP)
                                            </h2>

                                            <p className="shap-description">
                                                Các yếu tố ảnh hưởng mạnh nhất đến dự đoán carbon footprint
                                            </p>

                                            <div className="shap-features">

                                                {
                                                    result.shap.top_features.map(
                                                        (item, index) => {

                                                            const impact =
                                                                Number(item.impact)

                                                            const width =
                                                                Math.min(
                                                                    Math.abs(impact) * 120,
                                                                    100
                                                                )

                                                            return (

                                                                <div
                                                                    key={index}
                                                                    className="shap-row"
                                                                >

                                                                    <div className="shap-header">

                                                                        <span className="shap-feature-name">
                                                                            {
                                                                                featureLabels[item.feature]
                                                                                || item.feature
                                                                            }
                                                                        </span>

                                                                        <span
                                                                            className={
                                                                                impact > 0
                                                                                    ? "shap-impact positive"
                                                                                    : "shap-impact negative"
                                                                            }
                                                                        >
                                                                            {impact > 0 ? "+" : ""}
                                                                            {impact.toFixed(3)}
                                                                        </span>

                                                                    </div>

                                                                    <div className="shap-bar-wrapper">

                                                                        <div
                                                                            className={
                                                                                impact > 0
                                                                                    ? "shap-bar positive-bar"
                                                                                    : "shap-bar negative-bar"
                                                                            }
                                                                            style={{
                                                                                width: `${width}%`
                                                                            }}
                                                                        />

                                                                    </div>

                                                                </div>
                                                            )
                                                        }
                                                    )
                                                }

                                            </div>

                                        </div>
                                    )
                                }


                                {/* ========================= */}
                                {/* Risk Level */}
                                {/* ========================= */}

                                <div
                                    className={
                                        result.green_score >= 70
                                            ? "risk-low"
                                            : result.green_score >= 40
                                                ? "risk-medium"
                                                : "risk-high"
                                    }
                                >

                                    {
                                        result.green_score >= 70
                                            ? "🌱 Website xanh"
                                            : result.green_score >= 40
                                                ? "⚡ Mức phát thải trung bình"
                                                : "🔥 Phát thải carbon cao"
                                    }

                                </div>

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

                                        <div className="preview-header">

                                            <div>

                                                <h2>
                                                    Ảnh chụp Website
                                                </h2>

                                                <p>
                                                    Giao diện website tại thời điểm phân tích
                                                </p>

                                            </div>

                                            <div className="preview-status">

                                                {
                                                    result?.green_label === "green"

                                                        ? "🌱 Green Website"

                                                        : "🔥 Carbon Heavy"
                                                }

                                            </div>

                                        </div>

                                        <div className="preview-image-wrapper">

                                            <img
                                                src={screenshotUrl}
                                                alt="Website Preview"
                                                className="website-preview"

                                                onLoad={() => {

                                                    console.log(
                                                        "Ảnh load thành công:",
                                                        screenshotUrl
                                                    )
                                                }}

                                                onError={(e) => {

                                                    console.log(
                                                        "Ảnh lỗi:",
                                                        screenshotUrl
                                                    )

                                                    e.target.style.display = "none"
                                                }}
                                            />

                                            <div className="preview-overlay">

                                                <div className="preview-overlay-content">

                                                    <span>
                                                        Performance
                                                    </span>

                                                    <strong>
                                                        {result?.performance_score}
                                                    </strong>

                                                </div>

                                                <div className="preview-overlay-content">

                                                    <span>
                                                        CO₂
                                                    </span>

                                                    <strong>
                                                        {result?.co2} g
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )
                            }

                            {
                                result?.equivalent && (

                                    <div className="eco-card">

                                        <h2>
                                            Tác động môi trường tương đương
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
                                            Mô phỏng tối ưu hoá carbon
                                        </h2>

                                        <p>
                                            Lượng CO₂ sau tối ưu:
                                            {result.eco_mode.optimized_co2} g
                                        </p>

                                        <p>
                                            Lượng CO₂ giảm được:
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
                                                activeOuterRadius={125}
                                                paddingAngle={4}
                                                animationDuration={1200}
                                                labelLine={false}
                                                label={({ percent }) =>
                                                    `${(percent * 100).toFixed(0)}%`
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

                                            <text
                                                x="50%"
                                                y="46%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="pie-total-text"
                                            >
                                                Total Size
                                            </text>

                                            <text
                                                x="50%"
                                                y="56%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="pie-total-value"
                                            >
                                                {totalMB} MB
                                            </text>

                                            <Tooltip
                                                content={<ResourceTooltip />}
                                            />

                                            

                                        </PieChart>
                                        
                                        
                                    </ResponsiveContainer>
                                    <div className="resource-legend">

                                        {
                                            resourceData.map(
                                                (item, index) => (

                                                    <div
                                                        key={index}
                                                        className="legend-item"
                                                    >

                                                        <div
                                                            className="legend-color"
                                                            style={{
                                                                background:
                                                                    COLORS[index]
                                                            }}
                                                        />

                                                        <span>
                                                            {item.name}
                                                        </span>

                                                        <strong>
                                                            {
                                                                (
                                                                    item.value /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(2)
                                                            } MB
                                                        </strong>

                                                    </div>
                                                )
                                            )
                                        }

                                    </div>
                                    <div className="resource-insight">

                                        🔥 Thành phần gây tải lớn nhất:
                                        <strong>
                                            {heaviestResource?.name}
                                        </strong>

                                    </div>


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

                                            <defs>
                                                <linearGradient
                                                    id="greenGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#4ade80"
                                                    />

                                                    <stop
                                                        offset="100%"
                                                        stopColor="#16a34a"
                                                    />
                                                </linearGradient>
                                            </defs>

                                            <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{
                                                    fill: "rgba(34,197,94,0.08)"
                                                }}
                                            />

                                            <Bar
                                                dataKey="value"
                                                radius={[12, 12, 0, 0]}
                                                animationDuration={1800}
                                            >

                                                {
                                                    performanceData.map(
                                                        (entry, index) => (

                                                            <Cell
                                                                key={index}
                                                                fill={
                                                                    getMetricColor(
                                                                        entry.name,
                                                                        entry.value
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    )
                                                }

                                            </Bar>

                                        </BarChart>

                                        <div className="metric-legend">

                                            <div>
                                                🟢 Tốt
                                            </div>

                                            <div>
                                                🟡 Trung bình
                                            </div>

                                            <div>
                                                🔴 Cần tối ưu
                                            </div>

                                        </div>

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

                            📄 Xuất báo cáo PDF

                        </button>
                    )
                }
            </div>
    

            <Footer/>
        </>
    )
}

export default Home