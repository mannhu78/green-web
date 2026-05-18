import os
import time

from crawler.lighthouse_runner import (
    run_lighthouse
)

from crawler.parser import (
    parse_lighthouse,
    extract_resource_metrics
)

from crawler.carbon_calculator import (
    calculate_co2
)

from urllib.parse import urlparse


def analyze_website(url):

    report_path = "temp_report.json"

    start = time.time()

    # =========================
    # Run Lighthouse
    # =========================

    run_lighthouse(
        url,
        report_path,
        device="desktop"
    )

    elapsed = time.time() - start

    # =========================
    # Parse Metrics
    # =========================

    metrics = parse_lighthouse(
        report_path
    )

    # =========================
    # Resource Metrics
    # =========================

    main_domain = urlparse(
        url
    ).netloc

    resource_metrics = (
        extract_resource_metrics(
            metrics["requests"],
            main_domain=main_domain
        )
    )

    # =========================
    # CO2
    # =========================

    total_bytes = metrics[
        "total_bytes"
    ]

    co2 = calculate_co2(
        total_bytes
    )

    # =========================
    # Label
    # =========================

    if co2 < 0.5:
        label = "green"

    elif co2 < 1.5:
        label = "moderate"

    else:
        label = "heavy"

    # =========================
    # Remove report
    # =========================

    if os.path.exists(report_path):
        os.remove(report_path)

    return {

    "url": url,

    "performance_score":
        metrics["performance_score"],

    "co2":
        round(co2, 4),

    "green_label":
        label,

    "scan_time":
        round(elapsed, 2),

    # =========================
    # Page Info
    # =========================

    "total_bytes":
        total_bytes,

    "page_size_mb":
        round(
            total_bytes / (1024 * 1024),
            2
        ),

    "request_count":
        len(metrics["requests"]),

    # =========================
    # Resource Metrics
    # =========================

    "image_bytes":
        resource_metrics["image_bytes"],

    "js_bytes":
        resource_metrics["js_bytes"],

    "css_bytes":
        resource_metrics["css_bytes"],

    "font_bytes":
        resource_metrics["font_bytes"],

    "video_bytes":
        resource_metrics["video_bytes"],

    "image_count":
        resource_metrics["image_count"],

    "script_count":
        resource_metrics["script_count"],

    "third_party_requests":
        resource_metrics["third_party_requests"],

    # =========================
    # Lighthouse Metrics
    # =========================

    "lcp":
        metrics["lcp"],

    "fcp":
        metrics["fcp"],

    "cls":
        metrics["cls"],

    "tbt":
        metrics["tbt"],

    "unused_js":
        metrics["unused_js"],

    "unused_css":
        metrics["unused_css"],

    "main_thread_work":
        metrics["main_thread_work"],

    "server_response_time":
        metrics["server_response_time"],

    "render_blocking_count":
        metrics["render_blocking_count"],

    # =========================
    # Optimization Savings
    # =========================

    "optimized_images_savings":
        metrics["optimized_images_savings"],

    "webp_savings":
        metrics["webp_savings"]
}