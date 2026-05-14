import "../css/About.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
export default function About() {
    const metrics = [
        {
            title: "Performance Score",
            desc: "Đánh giá tổng thể hiệu năng website dựa trên Lighthouse. Điểm càng cao thì website càng nhanh và tối ưu."
        },
        {
            title: "LCP (Largest Contentful Paint)",
            desc: "Đo thời gian tải nội dung chính lớn nhất trên màn hình. LCP thấp giúp trải nghiệm người dùng tốt hơn."
        },
        {
            title: "FCP (First Contentful Paint)",
            desc: "Đo thời gian trình duyệt hiển thị nội dung đầu tiên của website."
        },
        {
            title: "CLS (Cumulative Layout Shift)",
            desc: "Đo mức độ xê dịch giao diện trong quá trình tải trang. CLS thấp giúp website ổn định hơn."
        },
        {
            title: "TBT (Total Blocking Time)",
            desc: "Đo thời gian JavaScript chặn trình duyệt phản hồi thao tác người dùng."
        },
        {
            title: "CO₂ Emission",
            desc: "Ước lượng lượng khí thải carbon sinh ra khi người dùng truy cập website."
        }
    ]

    const benefits = [
        "Giảm lượng phát thải carbon từ website",
        "Tăng tốc độ tải trang và cải thiện trải nghiệm người dùng",
        "Tối ưu SEO và Core Web Vitals",
        "Tiết kiệm băng thông và tài nguyên server",
        "Giảm tỷ lệ thoát trang",
        "Tăng khả năng mở rộng hệ thống"
    ]

    const helps = [
        {
            title: "Phân tích hiệu năng website",
            desc: "Đo lường hiệu suất website bằng Lighthouse và trực quan hóa dữ liệu theo thời gian thực."
        },
        {
            title: "Đánh giá phát thải CO₂",
            desc: "Ước tính lượng phát thải carbon dựa trên dung lượng tài nguyên website tải xuống."
        },
        {
            title: "Mô phỏng Eco Mode",
            desc: "Mô phỏng mức giảm phát thải khi tối ưu ảnh, video và JavaScript."
        },
        {
            title: "Đề xuất tối ưu hóa",
            desc: "Đưa ra các gợi ý cải thiện hiệu năng và giảm tiêu thụ tài nguyên."
        }
    ]

    return (

        <>
        <Header />
            
        <div className="about-page">

            {/* Hero Section */}
            <section className="hero-section">

                <div className="hero-bg"></div>

                <div className="hero-container">

                    <div>

                        <h1 className="hero-title">
                            Green Web
                            <span className="hero-highlight">
                                Analyzer
                            </span>
                        </h1>

                        <p className="hero-desc">
                            Nền tảng phân tích hiệu năng và phát thải carbon của website.
                            Hệ thống sử dụng Lighthouse để đánh giá hiệu suất,
                            trực quan hóa dữ liệu và đề xuất các giải pháp tối ưu hóa
                            nhằm xây dựng website thân thiện với môi trường.
                        </p>

                        <div className="hero-tags">

                            <div className="hero-tag">
                                ⚡ Performance Analytics
                            </div>

                            <div className="hero-tag">
                                🌱 Carbon Estimation
                            </div>

                            <div className="hero-tag">
                                📊 Eco Visualization
                            </div>

                        </div>

                    </div>

                    <div className="relative">

                        <img
                            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
                            alt="Green Web"
                            className="hero-image"
                        />

                    </div>

                </div>

            </section>


            {/* Why Green Web */}
            <section className="section">

                <div className="why-grid">

                    <div>

                        <img
                            src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop"
                            alt="Eco Technology"
                            className="why-image"
                        />

                    </div>

                    <div>

                        <h2 className="section-title">
                            Tại sao cần Website Xanh?
                        </h2>

                        <p className="hero-desc">
                            Các website hiện đại tiêu thụ rất nhiều dữ liệu thông qua hình ảnh,
                            video, JavaScript và các tài nguyên mạng. Điều này làm tăng tải server,
                            điện năng tiêu thụ và lượng phát thải carbon toàn cầu.
                        </p>

                        <div className="benefit-list">

                            {
                                benefits.map((item, index) => (
                                    <div
                                        key={index}
                                        className="benefit-card"
                                    >
                                        <div className="benefit-icon">
                                            ✓
                                        </div>

                                        <p className="text-slate-200">
                                            {item}
                                        </p>

                                    </div>
                                ))
                            }

                        </div>

                    </div>

                </div>

            </section>


            {/* Metrics */}
            <section className="metrics-section">

                <div className="section">

                    <div>

                        <h2 className="section-title">
                            Các chỉ số đo lường phổ biến
                        </h2>

                        <p className="section-desc">
                            Hệ thống sử dụng Lighthouse để phân tích hiệu năng và đánh giá
                            mức độ thân thiện môi trường của website.
                        </p>

                    </div>

                    <div className="metrics-grid">

                        {
                            metrics.map((metric, index) => (
                                <div
                                    key={index}
                                    className="metric-card"
                                >

                                    <h3 className="metric-title">
                                        {metric.title}
                                    </h3>

                                    <p className="metric-desc">
                                        {metric.desc}
                                    </p>

                                </div>
                            ))
                        }

                    </div>

                </div>

            </section>


            {/* Features */}
            <section className="section">

                <div>

                    <h2 className="section-title">
                        Chúng tôi có thể giúp gì cho bạn?
                    </h2>

                    <p className="section-desc">
                        Green Web Analyzer hỗ trợ phân tích, trực quan hóa và đề xuất tối ưu hóa website nhằm giảm phát thải carbon.
                    </p>

                </div>

                <div className="features-grid">

                    {
                        helps.map((item, index) => (
                            <div
                                key={index}
                                className="feature-card"
                            >

                                <h3 className="feature-title">
                                    {item.title}
                                </h3>

                                <p className="feature-desc">
                                    {item.desc}
                                </p>

                            </div>
                        ))
                    }

                </div>

                </section>
                
                {/* Green Web Foundation */}
                <section className="section">

                    <div className="gwf-box">

                        <div className="gwf-left">

                            <h2 className="section-title">
                                Tích hợp Green Web Foundation API
                            </h2>

                            <p className="section-desc">
                                Hệ thống sử dụng API từ Green Web Foundation để kiểm tra
                                website có được lưu trữ trên nền tảng hosting sử dụng
                                năng lượng tái tạo hay không.
                            </p>

                            <div className="gwf-features">

                                <div className="gwf-item">
                                    ✅ Kiểm tra Green Hosting theo thời gian thực
                                </div>

                                <div className="gwf-item">
                                    🌱 Xác định nhà cung cấp hosting xanh
                                </div>

                                <div className="gwf-item">
                                    ⚡ Kết hợp Lighthouse và Carbon Analysis
                                </div>

                                <div className="gwf-item">
                                    📊 Hỗ trợ đánh giá tính bền vững của website
                                </div>

                            </div>

                        </div>

                        <div className="gwf-right">

                            <div className="gwf-card">

                                <h3>
                                    Ví dụ kết quả
                                </h3>

                                <div className="gwf-status green">

                                    ✅ Green Hosted

                                </div>

                                <p>
                                    Provider:
                                    <span>
                                        Cloudflare
                                    </span>
                                </p>

                                <p>
                                    Dữ liệu được xác minh bởi
                                    Green Web Foundation API
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


            {/* Final CTA */}
            <section className="section">

                <div className="cta-box">

                    <h2 className="cta-title">
                        Xây dựng Website Nhanh hơn — Xanh hơn
                    </h2>

                    <p className="cta-desc">
                        Theo dõi hiệu năng website, phân tích lượng phát thải carbon
                        và tối ưu trải nghiệm người dùng với Green Web Analyzer.
                    </p>

                    <button className="cta-btn"><a href="/">Bắt đầu phân tích</a>
                        
                    </button>

                </div>

            </section>

            </div>
            
            <Footer/>
        </>
    )
}
