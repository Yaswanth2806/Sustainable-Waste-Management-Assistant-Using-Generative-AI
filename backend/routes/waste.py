"""
routes/waste.py — POST /api/analyze-waste

Constructs the Groq prompt, calls llama-3.3-70b-versatile, and returns the
structured JSON waste classification + disposal guide. Falls back to a
static response if the Groq API is unavailable.
"""
from flask import Blueprint, request, jsonify
from groq_client import analyze_waste_item, analyze_waste_image, static_fallback

waste_bp = Blueprint("waste", __name__)


@waste_bp.route("/analyze-waste", methods=["POST"])
def analyze_waste():
    payload = request.get_json(silent=True) or {}
    item_name = (payload.get("item") or "").strip()
    image_data = (payload.get("image") or "").strip()

    # --- Input validation ---
    if not item_name and not image_data:
        return jsonify({"error": "Either waste item name or image data is required."}), 400

    try:
        if image_data:
            result = analyze_waste_image(image_data)
            source = "groq_ai_vision"
        else:
            result = analyze_waste_item(item_name)
            source = "groq_ai"
    except RuntimeError as exc:
        print(f"RuntimeError in analyze_waste: {exc}")
        result = static_fallback(item_name or "Uploaded Image")
        source = "static_fallback"
    except Exception as exc:
        import traceback
        print(f"Exception in analyze_waste: {exc}")
        traceback.print_exc()
        result = static_fallback(item_name or "Uploaded Image")
        source = "static_fallback"

    return jsonify({"result": result, "source": source}), 200
