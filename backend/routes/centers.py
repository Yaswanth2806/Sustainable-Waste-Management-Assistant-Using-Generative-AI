"""
routes/centers.py — GET /api/get-centers

Returns static collection center data with realistic Hyderabad facility
data, filtered by waste type if a query parameter is provided. Centers are
always sorted by distance_km ascending. If no centers match the requested
type, all centers are returned as a fallback.
"""
from flask import Blueprint, request, jsonify

centers_bp = Blueprint("centers", __name__)

COLOR_CODES = {
    "recycling": "#2ecc71",
    "ewaste": "#9b59b6",
    "organic": "#f1c40f",
    "hazardous": "#e74c3c",
}

CENTERS = [
    {
        "center_id": "c1",
        "name": "GreenCycle Recycling Hub",
        "address": "Road No. 12, Banjara Hills, Hyderabad",
        "latitude": 17.4156,
        "longitude": 78.4347,
        "accepted_waste_types": ["Plastic Waste", "Paper Waste", "Glass Waste"],
        "contact_number": "+91 90000 11111",
        "opening_hours": "9:00 AM - 6:00 PM",
        "distance_km": 1.8,
        "facility_type": "recycling",
        "color_code": COLOR_CODES["recycling"],
    },
    {
        "center_id": "c2",
        "name": "Hitech E-Waste Collection Point",
        "address": "HITEC City, Madhapur, Hyderabad",
        "latitude": 17.4483,
        "longitude": 78.3915,
        "accepted_waste_types": ["E-waste", "Hazardous Waste"],
        "contact_number": "+91 90000 22222",
        "opening_hours": "10:00 AM - 5:00 PM",
        "distance_km": 4.2,
        "facility_type": "ewaste",
        "color_code": COLOR_CODES["ewaste"],
    },
    {
        "center_id": "c3",
        "name": "Urban Compost Collective",
        "address": "Jubilee Hills Check Post, Hyderabad",
        "latitude": 17.4326,
        "longitude": 78.4071,
        "accepted_waste_types": ["Organic Waste"],
        "contact_number": "+91 90000 33333",
        "opening_hours": "7:00 AM - 11:00 AM",
        "distance_km": 2.5,
        "facility_type": "organic",
        "color_code": COLOR_CODES["organic"],
    },
    {
        "center_id": "c4",
        "name": "SafeDispose Hazardous Materials Center",
        "address": "Gachibowli Main Road, Hyderabad",
        "latitude": 17.4401,
        "longitude": 78.3489,
        "accepted_waste_types": ["Hazardous Waste", "E-waste"],
        "contact_number": "+91 90000 44444",
        "opening_hours": "9:00 AM - 4:00 PM",
        "distance_km": 6.1,
        "facility_type": "hazardous",
        "color_code": COLOR_CODES["hazardous"],
    },
    {
        "center_id": "c5",
        "name": "Secunderabad Scrap & Metal Recyclers",
        "address": "SP Road, Secunderabad",
        "latitude": 17.4399,
        "longitude": 78.4983,
        "accepted_waste_types": ["Metal Waste", "Paper Waste"],
        "contact_number": "+91 90000 55555",
        "opening_hours": "9:30 AM - 6:30 PM",
        "distance_km": 8.7,
        "facility_type": "recycling",
        "color_code": COLOR_CODES["recycling"],
    },
    {
        "center_id": "c6",
        "name": "Kondapur Community Composting Site",
        "address": "Kondapur Main Road, Hyderabad",
        "latitude": 17.4615,
        "longitude": 78.3640,
        "accepted_waste_types": ["Organic Waste", "General Waste"],
        "contact_number": "+91 90000 66666",
        "opening_hours": "6:30 AM - 10:30 AM",
        "distance_km": 5.4,
        "facility_type": "organic",
        "color_code": COLOR_CODES["organic"],
    },
]


@centers_bp.route("/get-centers", methods=["GET"])
def get_centers():
    waste_type = request.args.get("waste_type") or request.args.get("type")

    if waste_type:
        filtered = [
            c for c in CENTERS
            if waste_type.lower() in [w.lower() for w in c["accepted_waste_types"]]
            or waste_type.lower() == c["facility_type"]
        ]
        # If no match after filtering, return all centers as fallback
        result = filtered if filtered else CENTERS
    else:
        result = CENTERS

    result_sorted = sorted(result, key=lambda c: c["distance_km"])
    return jsonify(result_sorted), 200
