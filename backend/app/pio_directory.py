def get_pio_details(category: str, location: str) -> dict:
    """
    A simple lookup table/heuristic for finding the correct Public Information Officer (PIO)
    based on the issue category and user's location.
    """
    if category == "tenant_dispute":
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
    return {
        "designation": "Public Information Officer",
        "department": "Relevant Public Authority",
        "address": location
    }
