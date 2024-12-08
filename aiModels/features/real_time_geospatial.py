import requests

GOOGLE_MAPS_API_KEY = "your_google_maps_api_key"

def get_travel_time(task_location, engineer_location):
    """
    Retrieves real-time travel time and distance between the task and engineer locations
    using Google Maps Distance Matrix API.

    Returns:
    - travel_time: Travel time in minutes.
    - distance: Distance in kilometres.
    """
    url = (
        f"https://maps.googleapis.com/maps/api/distancematrix/json"
        f"?origins={task_location}&destinations={engineer_location}&key={GOOGLE_MAPS_API_KEY}"
    )
    response = requests.get(url).json()
    try:
        travel_time = response["rows"][0]["elements"][0]["duration"]["value"] / 60
        distance = response["rows"][0]["elements"][0]["distance"]["value"] / 1000
        return travel_time, distance
    except KeyError:
        return None, None
