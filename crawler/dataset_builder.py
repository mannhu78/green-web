import pandas as pd
from tqdm import tqdm
import os
import time
import random

from urllib.parse import urlparse

from lighthouse_runner import run_lighthouse
from parser import (
    parse_lighthouse,
    extract_resource_metrics
)
from carbon_calculator import calculate_co2

dataset = []

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

URL_FILE = os.path.join(
    BASE_DIR,
    "urls.csv"
)

REPORT_DIR = os.path.join(
    BASE_DIR,
    "reports"
)
dataset_path = os.path.join(
    BASE_DIR,
    "dataset.csv"
)


os.makedirs(REPORT_DIR, exist_ok=True)

# =========================
# Load URLs
# =========================

url_df = pd.read_csv(
    URL_FILE
)

urls = url_df.to_dict(
    orient="records"
)

print(
    f"Loaded {len(urls)} URLs"
)


# =========================
# Crawl Loop
# =========================

from link_extractor import (
    extract_internal_links
)

all_urls = []
seen = set()

for item in urls:

    url = item["url"]

    category = item["category"]

    if url not in seen:

        all_urls.append({
            "url": url,
            "category": category
        })
        seen.add(url)

    internal_links = extract_internal_links(
        url,
        max_links=15
    )

    for link in internal_links:
        if not link.startswith("http"):
            continue

        link = link.rstrip("/")

        if link not in seen:

            all_urls.append({
                "url": link,
                "category": category
            })
            seen.add(link)
            second_level_links = extract_internal_links(
                link,
                max_links=3
            )

            for sub_link in second_level_links:

                if sub_link not in seen:

                    all_urls.append({
                        "url": sub_link,
                        "category": category
                    })

                    seen.add(sub_link)

print(
    f"Total URLs: {len(all_urls)}"
)

for i, item in enumerate(
    tqdm(all_urls)
):

    url = item["url"]

    category = item["category"]

    try:

        report_path = os.path.join(
            REPORT_DIR,
            f"report_{i}.json"
        )
        
        

        # =========================
        # Run Lighthouse
        # =========================
        start = time.time()
        success = False

        for attempt in range(3):

            try:
                for device in ["desktop", "mobile"]:

                    report_path = os.path.join(
                        REPORT_DIR,
                        f"report_{i}_{device}.json"
                    )

                    device_start = time.time()

                    run_lighthouse(
                        url,
                        report_path,
                        device=device
                    )

                    elapsed = time.time() - device_start

                    # =========================
                    # Parse Metrics
                    # =========================

                    metrics = parse_lighthouse(
                        report_path
                    )

                    # =========================
                    # Extract Features
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

                    total_bytes = metrics[
                        "total_bytes"
                    ]
                    page_size_mb = total_bytes / (1024 * 1024)

                    # =========================
                    # Calculate CO₂
                    # =========================

                    co2 = calculate_co2(
                        total_bytes
                    )
                    if co2 < 0.5:
                        green_label = "green"

                    elif co2 < 1.5:
                        green_label = "moderate"

                    else:
                        green_label = "heavy"


                    print(
                        f"✓ {url} | "
                        f"CO₂={co2:.4f}g | "
                        f"Time={elapsed:.2f}s"
                    )
                    

                    # =========================
                    # Build Dataset Row
                    # =========================

                    page_type = "general"

                    if any(
                        x in url.lower()
                        for x in [
                            "product",
                            "item",
                            "shop"
                        ]
                    ):
                        page_type = "product"

                    elif any(
                        x in url.lower()
                        for x in [
                            "blog",
                            "news",
                            "article"
                        ]
                    ):
                        page_type = "article"

                    elif any(
                        x in url.lower()
                        for x in [
                            "video",
                            "watch"
                        ]
                    ):
                        page_type = "media"

                    elif any(
                        x in url.lower()
                        for x in [
                            "login",
                            "dashboard",
                            "account"
                        ]
                    ):
                        page_type = "dashboard"
                        

                    row = {

                        "url": url,

                        "category": category,

                        "page_type": page_type,

                        "device": device,

                        "scan_time": elapsed,

                        "request_count":
                            len(metrics["requests"]),


                        "performance_score":
                            metrics[
                                "performance_score"
                            ],

                        "total_bytes":
                            total_bytes,

                        "page_size_mb": page_size_mb,

                        "image_bytes":
                            resource_metrics[
                                "image_bytes"
                            ],

                        "js_bytes":
                            resource_metrics[
                                "js_bytes"
                            ],

                        "css_bytes":
                            resource_metrics[
                                "css_bytes"
                            ],

                        "font_bytes":
                            resource_metrics[
                                "font_bytes"
                            ],

                        "video_bytes":
                            resource_metrics[
                                "video_bytes"
                            ],

                        "has_video":
                            1 if (
                                resource_metrics[
                                    "video_bytes"
                                ] > 0
                            ) else 0,

                        "image_count":
                            resource_metrics[
                                "image_count"
                            ],

                        "heavy_images":
                            1 if (
                                resource_metrics[
                                    "image_bytes"
                                ] > 2_000_000
                            ) else 0,

                        "script_count":
                            resource_metrics[
                                "script_count"
                            ],

                        "heavy_js":
                            1 if (
                                resource_metrics[
                                    "js_bytes"
                                ] > 1_500_000
                            ) else 0,

                        "third_party_requests":
                            resource_metrics[
                                "third_party_requests"
                            ],

                        "unused_js":
                            metrics[
                                "unused_js"
                            ],

                        "unused_css":
                            metrics[
                                "unused_css"
                            ],

                        "lcp":
                            metrics["lcp"],

                        "fcp":
                            metrics["fcp"],

                        "cls":
                            metrics["cls"],

                        "tbt":
                            metrics["tbt"],

                        "main_thread_work":
                            metrics["main_thread_work"],

                        "server_response_time":
                            metrics["server_response_time"],

                        "render_blocking_count":
                            metrics["render_blocking_count"],

                        "text_compression_savings":
                            metrics["text_compression_savings"],

                        "optimized_images_savings":
                            metrics["optimized_images_savings"],

                        "webp_savings":
                            metrics["webp_savings"],

                        "co2":
                            co2,

                        "green_label": green_label,
                    }

                    dataset.append(row)

                    if len(dataset) % 10 == 0:

                        checkpoint_df = pd.DataFrame(dataset)

                        if not os.path.exists(dataset_path):

                            checkpoint_df.to_csv(
                                dataset_path,
                                index=False
                            )

                        else:

                            checkpoint_df.to_csv(
                                dataset_path,
                                mode="a",
                                header=False,
                                index=False
                            )

                        dataset = []

                        print(
                            "Checkpoint saved"
                        )


                    # =========================
                    # Remove JSON report
                    # =========================

                    if os.path.exists(report_path):
                        os.remove(report_path)


                success = True
                break

            except Exception as e:

                print(
                    f"Retry {attempt+1}: {e}"
                )

        if not success:

            print(
                f"Failed: {url}"
            )

            continue
       
    except Exception as e:

        print(
            f"Error scanning {url}: {e}"
        )

        failed_path = os.path.join(
            BASE_DIR,
            "failed_urls.txt"
        )

        with open(
            failed_path,
            "a",
            encoding="utf-8"
        ) as f:

            f.write(
                f"{url} | {str(e)}\n"
            )
# =========================
# Save Dataset
# =========================

if len(dataset) > 0:

    final_df = pd.DataFrame(dataset)

    final_df.to_csv(
        dataset_path,
        mode="a",
        header=False,
        index=False
    )

print(
    f"\nDataset saved: "
    f"{dataset_path}"
)
