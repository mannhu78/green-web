from bs4 import BeautifulSoup
import requests

from urllib.parse import (
    urljoin,
    urlparse,
    urlunparse
)


def clean_url(url):

    parsed = urlparse(url)

    # remove query + fragment
    cleaned = parsed._replace(
        query="",
        fragment=""
    )

    return urlunparse(cleaned)


def extract_internal_links(
    base_url,
    max_links=10
):

    links = set()

    bad_keywords = [

        "logout",
        "signup",
        "register",
        "login",
        "privacy",
        "terms",
        "mailto:",
        "javascript:",
        "#"
    ]

    try:

        response = requests.get(

            base_url,

            timeout=10,

            headers={
                "User-Agent":
                "Mozilla/5.0"
            }
        )

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        domain = urlparse(
            base_url
        ).netloc

        for a in soup.find_all(
            "a",
            href=True
        ):

            href = a["href"]

            # skip bad links
            if any(
                bad in href.lower()
                for bad in bad_keywords
            ):
                continue

            # absolute url
            full_url = urljoin(
                base_url,
                href
            )

            # clean tracking params
            full_url = clean_url(
                full_url
            )

            parsed = urlparse(
                full_url
            )

            # only same domain
            if parsed.netloc != domain:
                continue

            # avoid files
            if full_url.endswith(

                (
                    ".jpg",
                    ".png",
                    ".pdf",
                    ".zip",
                    ".svg",
                    ".mp4"
                )

            ):
                continue

            links.add(full_url)

            if len(links) >= max_links:
                break

    except Exception as e:

        print(
            f"Link extraction error: {e}"
        )

    return list(links)