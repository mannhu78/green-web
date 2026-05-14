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
        setProgress(0)

        let fakeProgress = 0

        const interval = setInterval(() => {

            fakeProgress += 5

            if (fakeProgress <= 90) {
                setProgress(fakeProgress)
            }

        }, 1000)

        try {

            const [data1, data2] = await Promise.all([
                analyzeWebsite(url1),
                analyzeWebsite(url2)
            ])

            console.log(data1)
            console.log(data2)

            setResult1(data1)
            setResult2(data2)

            clearInterval(interval)

            setProgress(100)

        } catch (err) {

            console.error(err)
            alert("Compare failed")

        } finally {

            setTimeout(() => {

                setLoading(false)
                setProgress(0)

            }, 500)
        }
    }


    let winner = null

    if (
        result1?.performance_score &&
        result2?.performance_score
    ) {

        winner =
            result1.performance_score >
                result2.performance_score

                ? result1.url
                : result2.url
    }

    return (
        <>
            <Header />

            <div className="compare-container">

                <h1 className="compare-title">
                    Compare Websites
                </h1>

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
                                ? "Comparing..."
                                : "Compare"
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
                                Comparing websites...
                                {progress}%
                            </p>

                        </div>
                    )
                }

                {
                    result1 && result2 && (

                        <div className="compare-grid">

                            <div className="compare-card">

                                <h2>{result1.url}</h2>

                                <p>
                                    Performance:
                                    {
                                        result1.performance_score || "N/A"
                                    }
                                </p>

                                <p>
                                    CO₂:
                                    {result1.co2} g
                                </p>

                                <p>
                                    LCP:
                                    {result1.lcp}
                                </p>

                                <p>
                                    Requests:
                                    {result1.request_count}
                                </p>
                                {
                                    result1?.error && (

                                        <p className="compare-error">
                                            {result1.error}
                                        </p>
                                    )
                                }

                            </div>

                            <div className="compare-card">

                                <h2>{result2.url}</h2>

                                <p>
                                    Performance:
                                    {result2.performance_score}
                                </p>

                                <p>
                                    CO₂:
                                    {result2.co2} g
                                </p>

                                <p>
                                    LCP:
                                    {result2.lcp}
                                </p>

                                <p>
                                    Requests:
                                    {result2.request_count}
                                </p>

                                {
                                    result2.error && (

                                        <div className="compare-error">

                                            {result2.error}

                                        </div>
                                    )
                                }

                            </div>

                        </div>

                        
                    )

                    
                }

                {
                    winner && (

                        <div className="winner-card">

                            🏆 Website tốt hơn:

                            <span>
                                {winner}
                            </span>

                        </div>
                    )
                }

            </div>

            <Footer />
        </>
    )
}

export default Compare