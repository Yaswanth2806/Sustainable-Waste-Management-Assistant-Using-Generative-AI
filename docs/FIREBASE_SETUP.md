# Cloud Infrastructure Provisioning: Firebase Setup

This guide details the requisite steps for provisioning Google Firebase as the cloud authentication and data persistence backbone for the EcoSprout AI platform.

## Pre-requisites

Ensure you possess administrative access to a Google Cloud or Firebase Console account prior to beginning the provisioning sequence.

## Implementation Steps

### Step 1: Initialize Cloud Workspace
Access the [Firebase Console](https://console.firebase.google.com/) and provision a new project named `EcoSproutAI`. This serves as the unified resource container for identity and data services.

### Step 2: Provision Identity Services
Navigate to **Build → Authentication → Sign-in method** within the console. Enable the **Email/Password** identity provider to securely manage user authentication lifecycles.

### Step 3: Provision Data Persistence layer
Navigate to **Build → Firestore Database** and instantiate a new NoSQL database. Select "Test Mode" for initial development environments (ensure you apply stringent security rules prior to production deployment). 

The application architecture will programmatically instantiate the following collections upon execution:
- `users/{userId}` — Persists authenticated user profiles, encompassing identity metadata.
- `waste_logs/{logId}` — Acts as an immutable audit trail, persisting waste entity definitions, categorical classifications, diagnostic LLM responses, hazard flags, and UTC timestamps.

### Step 4: Generate Service Account Credentials
To grant the application server administrative access to the Firebase resources, navigate to **Project Settings → Service Accounts → Generate New Private Key**. 
1. Download the generated JSON credential payload.
2. Rename the payload strictly to `serviceAccountKey.json`.
3. Securely transfer the file into the `backend/` directory of the repository.

### Step 5: Configure Presentation Tier SDK
To authorize the React client, navigate to **Project Settings → General → Your Apps → Add Web App**. Extract the provided Firebase configuration block and transpose the corresponding variable values into the client-side environment file (`frontend/.env`), referencing `frontend/.env.example` for the required schema.

### Step 6: Security and Credential Management
Exercise stringent credential hygiene. Ensure all API keys, service account payloads, and environment configurations remain excluded from source control. Both `.env` and `serviceAccountKey.json` are implicitly excluded via the repository's `.gitignore` policy.

> [!NOTE]
> **Ephemeral Fallback Architecture (Demo Mode)**
> If the `serviceAccountKey.json` or `.env` configurations are absent or malformed, the platform implements a gracefully degrading failover. The identity service is bypassed, and all telemetry is directed to an ephemeral in-memory datastore bounded by the application server session.
