def simulate_eco_mode(data):

    original_co2 = data["co2"]

    total_bytes = data["total_bytes"]

    # =========================
    # Simulate reductions
    # =========================

    image_reduction = (
        data["optimized_images_savings"] * 0.8
    )

    webp_reduction = (
        data["webp_savings"] * 0.9
    )

    js_reduction = (
        data["unused_js"] * 0.7
    )

    video_reduction = (
        data["video_bytes"] * 0.5
    )

    saved_bytes = (
        image_reduction
        + webp_reduction
        + js_reduction
        + video_reduction
    )

    # fallback demo effect
    if saved_bytes <= 0:

        saved_bytes = total_bytes * 0.15

    # =========================
    # Convert bytes → CO2
    # =========================

    reduction_ratio = (
        saved_bytes / total_bytes
    )

    saved_co2 = (
        original_co2 * reduction_ratio
    )

    optimized_co2 = (
        original_co2 - saved_co2
    )

    improvement = (
        saved_co2 / original_co2
    ) * 100

    return {

        "optimized_co2":
            round(optimized_co2, 4),

        "saved_co2":
            round(saved_co2, 4),

        "green_improvement":
            round(improvement, 2)
    }