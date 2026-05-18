
def calculate_green_score(result, ml_result):

    # =========================
    # Lighthouse Performance
    # =========================

    performance_score = (
        result.get("performance_score", 0)
    )

    # =========================
    # CO2 Score
    # =========================

    co2 = result.get("co2", 0)

    if co2 <= 0.2:
        carbon_score = 100

    elif co2 <= 0.5:
        carbon_score = 80

    elif co2 <= 1:
        carbon_score = 60

    elif co2 <= 2:
        carbon_score = 40

    else:
        carbon_score = 20

    # =========================
    # Resource Efficiency
    # =========================

    total_bytes = result.get(
        "total_bytes",
        0
    )

    request_count = result.get(
        "request_count",
        0
    )

    resource_score = 100

    # page too large
    if total_bytes > 5000000:
        resource_score -= 30

    elif total_bytes > 3000000:
        resource_score -= 15

    # too many requests
    if request_count > 150:
        resource_score -= 30

    elif request_count > 80:
        resource_score -= 15

    resource_score = max(
        resource_score,
        0
    )

    # =========================
    # AI Score
    # =========================

    ai_probability = float(
        ml_result.get("probability", 0)
    )

    ai_score = (
        (1 - ai_probability) * 100
    )

    # =========================
    # Final Weighted Score
    # =========================

    final_score = (

        performance_score * 0.35 +

        carbon_score * 0.30 +

        resource_score * 0.20 +

        ai_score * 0.15
    )

    return round(
        final_score,
        2
    )

