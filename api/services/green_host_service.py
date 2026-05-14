import requests

def check_green_host(url):

    try:

        clean_url = (
            url
            .replace("https://", "")
            .replace("http://", "")
            .split("/")[0]
        )

        api_url = (
            f"https://api.thegreenwebfoundation.org/greencheck/{clean_url}"
        )

        response = requests.get(api_url)

        data = response.json()

        return {

            "green": data.get("green", False),

            "hosted_by":
                data.get("hosted_by", "Unknown"),

            "hosted_by_website":
                data.get("hosted_by_website", ""),

            "partner":
                data.get("partner", "")
        }

    except Exception as e:

        return {
            "error": str(e)
        }