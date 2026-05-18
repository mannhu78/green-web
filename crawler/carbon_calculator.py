def calculate_co2(total_bytes):

    # bytes -> GB
    gb = total_bytes / (1024 ** 3)

    # sustainable web design factor
    K_NODE = 0.06

    # power usage effectiveness
    PUE = 0.2

    # average grid intensity
    CARBON_INTENSITY = 475

    energy = gb * K_NODE * (1 + PUE)

    co2 = energy * CARBON_INTENSITY

    return round(co2, 4)