"""
groq_client.py — wraps the Groq API call for waste classification using
llama-3.3-70b-versatile, per the project's AI processing spec:
temperature 0.3, max_tokens 800, structured JSON output, markdown stripped.
"""
import os
import json
import re

GROQ_MODEL = "llama-3.3-70b-versatile"
_client = None

CATEGORIES = [
    "Organic Waste", "Plastic Waste", "Paper Waste", "Glass Waste",
    "Metal Waste", "E-waste", "Hazardous Waste", "General Waste",
]

SYSTEM_PROMPT = f"""You are the AI engine for EcoSprout AI, a civic waste
management assistant. Given a waste item name, return ONLY a single JSON
object (no markdown fences, no commentary) with exactly these fields:

{{
  "item": string (the waste item as provided),
  "category": one of {CATEGORIES},
  "category_icon": a single relevant emoji,
  "is_recyclable": boolean,
  "is_hazardous": boolean,
  "is_reusable": boolean,
  "disposal_instructions": string (2-3 clear sentences in plain English, NO technical jargon),
  "recycling_steps": [string, string, string, string] (exactly 4 practical steps in plain English, NO technical jargon),
  "hazard_warning": string or null (required if is_hazardous is true, else null),
  "eco_suggestions": [string, string, string] (exactly 3 lifestyle improvement tips in plain English, NO technical jargon),
  "accepted_at": [string, string, string] (exactly 3 facility types that accept this waste, e.g. "Recycling Center", "E-waste Collection Point")
}}

Be concise, accurate, and practical. Ensure all text responses are written in clean, plain English without any technical or complex jargon so that a layperson can easily understand them."""


def _get_client():
    global _client
    if _client is None:
        from groq import Groq
        api_key = (os.getenv("GROQ_API_KEY") or "").strip()
        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not set in backend/.env")
        _client = Groq(api_key=api_key)
    return _client


def _strip_markdown_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    return text


REQUIRED_FIELDS = [
    "item", "category", "category_icon", "is_recyclable", "is_hazardous",
    "is_reusable", "disposal_instructions", "recycling_steps",
    "hazard_warning", "eco_suggestions", "accepted_at",
]


def analyze_waste_item(item_name: str) -> dict:
    """Calls Groq llama-3.3-70b-versatile and returns a validated dict."""
    client = _get_client()

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Waste item: {item_name}"},
        ],
        temperature=0.3,
        max_tokens=800,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content
    cleaned = _strip_markdown_fences(raw)
    data = json.loads(cleaned)

    for field in REQUIRED_FIELDS:
        if field not in data:
            raise ValueError(f"AI response missing required field: {field}")

    data["item"] = data.get("item") or item_name
    return data


def analyze_waste_image(base64_image: str) -> dict:
    """Calls Groq meta-llama/llama-4-scout-17b-16e-instruct with a base64 image and returns a validated dict."""
    client = _get_client()

    # Ensure the base64 image has the proper prefix
    if not base64_image.startswith("data:image/"):
        # Assume jpeg if no mime type is provided
        base64_image = f"data:image/jpeg;base64,{base64_image}"

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": SYSTEM_PROMPT + "\n\nAnalyze this image of a waste item. Identify what it is, and then classify it according to the instructions above."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": base64_image,
                        },
                    },
                ],
            }
        ],
        temperature=0.3,
        max_tokens=800,
    )

    raw = response.choices[0].message.content
    cleaned = _strip_markdown_fences(raw)
    data = json.loads(cleaned)

    for field in REQUIRED_FIELDS:
        if field not in data:
            raise ValueError(f"AI response missing required field: {field}")

    return data


def static_fallback(item_name: str) -> dict:
    """Used if the Groq API is unavailable — keeps the app usable offline."""
    return {
        "item": item_name,
        "category": "General Waste",
        "category_icon": "🗑️",
        "is_recyclable": False,
        "is_hazardous": False,
        "is_reusable": False,
        "disposal_instructions": (
            "We couldn't reach the AI service right now. As a general rule, "
            "rinse the item if applicable and dispose of it in your nearest "
            "general waste bin, or check your local municipal guidelines."
        ),
        "recycling_steps": [
            "Check the item for a recycling symbol.",
            "Rinse off any food or liquid residue.",
            "Separate any mixed materials if possible.",
            "Place in the correct municipal recycling bin.",
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Consider reusable alternatives where possible.",
            "Reduce single-use purchases.",
            "Donate items that are still usable.",
        ],
        "accepted_at": ["General Waste Bin", "Municipal Collection Point", "Recycling Center"],
        "source": "static_fallback",
    }
