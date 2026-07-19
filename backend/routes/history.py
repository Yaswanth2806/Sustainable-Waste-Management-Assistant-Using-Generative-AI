"""
routes/history.py
- POST /api/save-history    — save a waste scan record to Firestore
- GET  /api/get-history     — last 50 scan records for the current user
- GET  /api/dashboard-data  — aggregated stats, category counts, 7-day trend
"""
from collections import Counter
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from firebase_config import save_waste_log, get_waste_logs

history_bp = Blueprint("history", __name__)


def _get_user_id(payload_or_args) -> str:
    return (payload_or_args.get("user_id") or "demo-user").strip()


@history_bp.route("/save-history", methods=["POST"])
def save_history():
    payload = request.get_json(silent=True) or {}
    user_id = _get_user_id(payload)
    result = payload.get("result")

    # --- Validation ---
    if not user_id:
        return jsonify({"error": "User ID must be present for all Firestore save operations."}), 400
    if not result or not isinstance(result, dict):
        return jsonify({"error": "A valid 'result' object is required."}), 400

    log_data = {
        "item_name": result.get("item"),
        "category": result.get("category"),
        "category_icon": result.get("category_icon"),
        "is_recyclable": bool(result.get("is_recyclable")),
        "is_hazardous": bool(result.get("is_hazardous")),
        "ai_response": result,
    }

    saved = save_waste_log(user_id, log_data)
    return jsonify(saved), 201


@history_bp.route("/get-history", methods=["GET"])
def get_history():
    user_id = _get_user_id(request.args)
    limit = int(request.args.get("limit", 50))
    logs = get_waste_logs(user_id, limit=limit)
    return jsonify(logs), 200


@history_bp.route("/dashboard-data", methods=["GET"])
def dashboard_data():
    user_id = _get_user_id(request.args)
    logs = get_waste_logs(user_id, limit=1000)

    total_items = len(logs)
    recyclable_count = sum(1 for l in logs if l.get("is_recyclable"))
    hazardous_count = sum(1 for l in logs if l.get("is_hazardous"))
    non_recyclable_count = total_items - recyclable_count
    recycle_rate = round((recyclable_count / total_items) * 100, 1) if total_items else 0.0

    category_counts = Counter(l.get("category", "Unknown") for l in logs)

    today = datetime.utcnow().date()
    day_labels = [(today - timedelta(days=i)).isoformat() for i in range(6, -1, -1)]
    day_counts = {d: 0 for d in day_labels}
    for l in logs:
        day = l.get("date", "")
        if day in day_counts:
            day_counts[day] += 1

    return jsonify({
        "summary": {
            "total_items_scanned": total_items,
            "recyclable_count": recyclable_count,
            "recycle_rate_percent": recycle_rate,
            "hazardous_item_count": hazardous_count,
        },
        "doughnut": {
            "recyclable": recyclable_count,
            "non_recyclable": non_recyclable_count,
            "hazardous": hazardous_count,
        },
        "category_breakdown": dict(category_counts),
        "weekly_trend": {
            "labels": day_labels,
            "counts": [day_counts[d] for d in day_labels],
        },
    }), 200
