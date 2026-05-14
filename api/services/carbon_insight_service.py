def generate_carbon_equivalent(co2):

    phone_charge = co2 / 0.008
    led_hour = co2 / 0.04

    return {
        "phone_charges":
            round(phone_charge, 1),

        "led_hours":
            round(led_hour, 1)
    }