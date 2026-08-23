def get_pio_details(category: str, location: str) -> dict:
    """
    A simple lookup table/heuristic for finding the correct Public Information Officer (PIO)
    based on the issue category and user's location.
    """
    if category in ["tenant_dispute", "landlord_dispute"]:
        return {
            "designation": "State Public Information Officer (SPIO)",
            "department": "Office of the Rent Controller / Competent Authority",
            "address": f"District Court Complex, {location}"
        }
    elif category == "municipal_civic":
        return {
            "designation": "State Public Information Officer (SPIO)",
            "department": "Municipal Corporation / Civic Body",
            "address": f"Zonal/Ward Office, {location}"
        }
    elif category == "consumer_dispute":
        return {
            "designation": "Public Information Officer",
            "department": "District Consumer Disputes Redressal Commission",
            "address": f"Consumer Court, {location}"
        }
    elif category == "labour_dispute":
        return {
            "designation": "Public Information Officer",
            "department": "Office of the Labour Commissioner",
            "address": f"Labour Office, {location}"
        }
    return {
        "designation": "Public Information Officer",
        "department": "Relevant Public Authority",
        "address": location
    }
