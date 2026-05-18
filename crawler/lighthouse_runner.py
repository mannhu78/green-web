import subprocess

LIGHTHOUSE_PATH = (
    r"C:\Users\Admin\AppData\Roaming\npm\lighthouse.cmd"
)

def run_lighthouse(
    url,
    output_path,
    device="desktop"
):

    command = [
        LIGHTHOUSE_PATH,
        url,
        "--quiet",
        "--chrome-flags=--headless",
        "--output=json",
        f"--output-path={output_path}",
        "--max-wait-for-load=45000",
        "--disable-storage-reset",
        "--throttling-method=devtools",
    ]

    if device == "mobile":

        command.append("--preset=perf")

    else:

        command.extend([
            "--screenEmulation.disabled",
            "--preset=desktop"
        ])

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        timeout=90
    )

    if result.returncode != 0:

        print(result.stderr)

        raise Exception(
            f"Lighthouse failed for {url}"
        )