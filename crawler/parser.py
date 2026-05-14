import json
from urllib.parse import urlparse


def extract_resource_metrics(
    requests,
    main_domain=None
):

    image_bytes = 0
    js_bytes = 0
    css_bytes = 0
    font_bytes = 0
    video_bytes = 0

    image_count = 0
    script_count = 0

    third_party = 0
    total_requests = len(requests)

    for req in requests:

        resource_type = str(
            req.get("resourceType", "")
        ).lower()

        size = req.get(
            "transferSize"
        ) or 0

        url = req.get("url", "")

        mime_type = str(
            req.get("mimeType", "")
        ).lower()

        # =========================
        # Resource Size Tracking
        # =========================

        if resource_type == "image":

            image_bytes += size
            image_count += 1

        elif resource_type == "script":

            js_bytes += size
            script_count += 1

        elif resource_type == "stylesheet":

            css_bytes += size

        elif resource_type == "font":

            font_bytes += size

        elif (
            "video" in mime_type or
            resource_type == "media"
        ):

            video_bytes += size

        # =========================
        # Third-party Detection
        # =========================

        try:

            req_domain = urlparse(
                url
            ).netloc

            if (
                main_domain and
                main_domain not in req_domain
            ):

                third_party += 1

        except Exception:
            pass

    return {

        "total_requests":
            total_requests,

        "image_bytes":
            image_bytes,

        "js_bytes":
            js_bytes,

        "css_bytes":
            css_bytes,

        "font_bytes":
            font_bytes,

        "video_bytes":
            video_bytes,

        "image_count":
            image_count,

        "script_count":
            script_count,

        "third_party_requests":
            third_party
    }


def parse_lighthouse(json_path):

    with open(
        json_path,
        "r",
        encoding="utf-8"
    ) as f:

        data = json.load(f)

    audits = data.get(
        "audits",
        {}
    )

    categories = data.get(
        "categories",
        {}
    )

    # =========================
    # Performance Score
    # =========================

    performance_score = (
        categories.get(
            "performance",
            {}
        ).get("score", 0) * 100
    )

    # =========================
    # Total Bytes
    # =========================

    total_bytes = audits.get(
        "total-byte-weight",
        {}
    ).get(
        "numericValue",
        0
    )

    # =========================
    # Network Requests
    # =========================

    requests = audits.get(
        "network-requests",
        {}
    ).get(
        "details",
        {}
    ).get(
        "items",
        []
    )

    # =========================
    # Unused JS/CSS
    # =========================

    unused_js = audits.get(
        "unused-javascript",
        {}
    ).get(
        "numericValue",
        0
    )

    unused_css = audits.get(
        "unused-css-rules",
        {}
    ).get(
        "numericValue",
        0
    )

    # =========================
    # Core Web Vitals
    # =========================

    lcp = audits.get(
        "largest-contentful-paint",
        {}
    ).get(
        "numericValue",
        0
    )

    fcp = audits.get(
        "first-contentful-paint",
        {}
    ).get(
        "numericValue",
        0
    )

    cls = audits.get(
        "cumulative-layout-shift",
        {}
    ).get(
        "numericValue",
        0
    )

    tbt = audits.get(
        "total-blocking-time",
        {}
    ).get(
        "numericValue",
        0
    )

    # =========================
    # Advanced Metrics
    # =========================

    main_thread_work = audits.get(
        "mainthread-work-breakdown",
        {}
    ).get(
        "numericValue",
        0
    )

    server_response_time = audits.get(
        "server-response-time",
        {}
    ).get(
        "numericValue",
        0
    )

    render_blocking_count = len(
        audits.get(
            "render-blocking-resources",
            {}
        ).get(
            "details",
            {}
        ).get(
            "items",
            []
        )
    )

    text_compression_savings = len(
        audits.get(
            "uses-text-compression",
            {}
        ).get(
            "details",
            {}
        ).get(
            "items",
            []
        )
    )

    optimized_images_savings = len(
        audits.get(
            "uses-optimized-images",
            {}
        ).get(
            "details",
            {}
        ).get(
            "items",
            []
        )
    )

    webp_savings = len(
        audits.get(
            "modern-image-formats",
            {}
        ).get(
            "details",
            {}
        ).get(
            "items",
            []
        )
    )

    return {

        "performance_score":
            performance_score,

        "total_bytes":
            total_bytes,

        "requests":
            requests,

        "unused_js":
            unused_js,

        "unused_css":
            unused_css,

        "lcp":
            lcp,

        "fcp":
            fcp,

        "cls":
            cls,

        "tbt":
            tbt,

        # =========================
        # Advanced Metrics
        # =========================

        "main_thread_work":
            main_thread_work,

        "server_response_time":
            server_response_time,

        "render_blocking_count":
            render_blocking_count,

        "text_compression_savings":
            text_compression_savings,

        "optimized_images_savings":
            optimized_images_savings,

        "webp_savings":
            webp_savings
    }