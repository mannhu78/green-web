def generate_suggestions(data):

    suggestions = []

    # =========================
    # JavaScript
    # =========================

    if data["unused_js"] > 200000:

        suggestions.append(
            "Có nhiều JavaScript không sử dụng. Nên xoá hoặc tách nhỏ các script dư thừa."
        )

    # =========================
    # Images
    # =========================

    if data["image_bytes"] > 2_000_000:

        suggestions.append(
            "Hình ảnh có dung lượng lớn. Nên nén ảnh hoặc chuyển sang định dạng WebP."
        )

    # =========================
    # LCP
    # =========================

    if data["lcp"] > 2500:

        suggestions.append(
            "Thời gian tải nội dung chính (LCP) cao. Nên tối ưu ảnh banner và tốc độ server."
        )

    # =========================
    # TBT
    # =========================

    if data["tbt"] > 300:

        suggestions.append(
            "Total Blocking Time cao. Nên giảm các tác vụ JavaScript nặng."
        )

    # =========================
    # CSS
    # =========================

    if data["css_bytes"] > 500000:

        suggestions.append(
            "File CSS quá lớn. Nên minify và loại bỏ CSS không sử dụng."
        )

    # =========================
    # Green Website
    # =========================

    if len(suggestions) == 0:

        suggestions.append(
            "Website đã được tối ưu khá tốt và thân thiện với môi trường."
        )

    return suggestions