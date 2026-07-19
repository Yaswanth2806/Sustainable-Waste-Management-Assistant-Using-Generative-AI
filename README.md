# EcoSprout AI: Enterprise Waste Management & Analytics Platform

> **Intelligent Classification. Sustainable Outcomes.**

EcoSprout AI is a comprehensive generative AI platform designed to modernize civic and enterprise waste management. By integrating advanced machine learning classification with localized geospatial data and predictive analytics, the platform empowers organizations and citizens to make environmentally responsible disposal decisions at scale.

## Core Capabilities

- **Intelligent Diagnostics & Classification** — Utilizing Groq's high-throughput `llama-3.3-70b-versatile` engine, the platform rapidly categorizes unstructured inputs (text or optical data) into standardized waste taxonomies.
- **Automated Lifecycle Guidance** — Generates precise, step-by-step recycling workflows, regulatory hazard warnings, and sustainable alternatives tailored to the specific material composition of the queried item.
- **Geospatial Logistics Integration** — Features a dynamic, Leaflet-powered geographic information system (GIS) mapping collection facilities. Facilities are indexed by waste capacity and proximity, optimizing routing for disposal.
- **Comprehensive Audit Trails** — Maintains immutable, chronological records of all categorization events, enabling robust compliance tracking and user behavior auditing.
- **Telemetry & Analytics Dashboard** — Aggregates classification data into high-level visualizations using Chart.js, surfacing critical KPIs such as facility diversion rates, hazardous material frequencies, and longitudinal user engagement trends.
- **Secure Authentication Architecture** — Implements robust identity management via Firebase Authentication, with a fail-safe localized memory store for seamless demonstration environments.

## Architecture Overview

| Layer | Technology |
|---|---|
| **Presentation Tier** | React.js (Vite), Tailwind CSS |
| **Identity Management** | Firebase Authentication |
| **Application Server** | Python 3.9+, Flask, Blueprint Modules |
| **Data Persistence** | Firebase Firestore (NoSQL) |
| **Inference Engine** | Groq API (`llama-3.3-70b-versatile`) |
| **GIS Rendering** | Leaflet.js, OpenStreetMap |
| **Data Visualization** | Chart.js, react-chartjs-2 |
| **Typography System** | Plus Jakarta Sans, Space Mono, Barlow Condensed |

## Project Structure

```
ecosprout-ai/
├── backend/
│   ├── routes/              # Modular API controllers (waste, history, centers)
│   ├── app.py               # Application server entrypoint
│   ├── firebase_config.py   # Cloud infrastructure initialization
│   ├── groq_client.py       # LLM inference service wrapper
│   └── requirements.txt     # Python dependency manifest
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI primitives (ResultCard, Navbar)
│   │   ├── pages/           # High-level route views (Dashboard, MapPage)
│   │   ├── context/         # React context providers (AuthContext)
│   │   └── services/        # External API integration clients
│   ├── tailwind.config.js   # UI design token configuration
│   └── package.json         # Node.js dependency manifest
├── docs/                    # Technical implementation guides
└── README.md
```

## Deployment & Execution Guide

### Prerequisites
- Python 3.9+ and Node.js 18+ environment
- Provisioned [Groq API key](https://console.groq.com/keys)
- (Optional) Initialized Firebase project for production environments (see [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md)). Without Firebase, the application operates in a localized demonstration mode.

### 1. Application Server Initialization

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Populate .env with GROQ_API_KEY
python app.py
```

The Flask server will bind to `http://localhost:5000`. Run a health check via `http://localhost:5000/api/health` to confirm the service status.

### 2. Presentation Tier Initialization

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite development server will bind to `http://localhost:5173`. Access the client interface via a modern web browser. 

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System readiness and health check. |
| `POST` | `/api/analyze-waste` | Submits unstructured data for LLM classification. |
| `POST` | `/api/save-history` | Persists a structured classification event to the datastore. |
| `GET` | `/api/get-history` | Retrieves a paginated audit trail of historical user queries. |
| `GET` | `/api/dashboard-data` | Aggregates telemetry data for analytics visualization. |
| `GET` | `/api/get-centers` | Queries the localized facility database with optional category filters. |

## Strategic Roadmap

Subsequent iterations will focus on expanding diagnostic capabilities via integration with edge-deployed computer vision models, establishing secure telemetry pipelines with municipal IoT infrastructure, and providing robust multi-tenant authentication protocols for enterprise adoption.

## Technical Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System Architecture and Request Lifecycle
- [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md) — Cloud Datastore and Identity Setup
- [`docs/GROQ_SETUP.md`](docs/GROQ_SETUP.md) — Inference Engine Provisioning

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
