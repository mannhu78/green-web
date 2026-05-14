import "../css/Footer.css"

function Footer() {

    return (

        <footer className="gw-footer">

            <div className="gw-footer-container">

                <div className="gw-footer-brand">

                    <h2>
                        🌱 Green Web Analyzer
                    </h2>

                    <p>
                        Phân tích hiệu năng website và lượng phát thải carbon
                        để xây dựng nền tảng web xanh và bền vững.
                    </p>

                </div>

                <div className="gw-footer-links">

                    <h3>
                        Navigation
                    </h3>

                    <a href="/">
                        Home
                    </a>

                    <a href="/about">
                        About
                    </a>

                </div>

                <div className="gw-footer-contact">

                    <h3>
                        Technologies
                    </h3>

                    <p>React + Flask</p>
                    <p>Lighthouse</p>
                    <p>Machine Learning</p>

                </div>

            </div>

            <div className="gw-footer-bottom">

                © 2026 Green Web Analyzer

            </div>

        </footer>
    )
}

export default Footer