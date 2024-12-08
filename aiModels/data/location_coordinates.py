def get_location_coordinates():
    """
    Provides geographic coordinates for predefined locations.
    
    Returns:
        dict: A dictionary mapping location names to their coordinates (latitude, longitude).
    """
    return {
        "Area1": (51.5074, -0.1278),  # Example: London
        "Area2": (48.8566, 2.3522),   # Example: Paris
        "Area3": (40.7128, -74.0060), # Example: New York
        "Area4": (35.6895, 139.6917), # Example: Tokyo
        "Area5": (34.0522, -118.2437) # Example: Los Angeles
    }

def reverse_lookup_coordinates(latitude, longitude):
    """
    Reverse lookup to find the nearest location based on coordinates.
    
    Parameters:
        latitude (float): Latitude of the location.
        longitude (float): Longitude of the location.
        
    Returns:
        str: The nearest location name.
    """
    from geopy.distance import geodesic

    locations = get_location_coordinates()
    nearest_location = min(
        locations.items(),
        key=lambda item: geodesic((latitude, longitude), item[1]).km
    )

    return nearest_location[0]
