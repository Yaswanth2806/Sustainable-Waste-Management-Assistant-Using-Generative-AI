# Inference Engine Provisioning: Groq API Setup

The EcoSprout AI platform relies on Groq's high-throughput `llama-3.3-70b-versatile` language model to execute its core waste classification and lifecycle generation algorithms.

## Provisioning Workflow

### Step 1: Instantiate a Groq Developer Account
Navigate to the [Groq Cloud Console](https://console.groq.com) and instantiate a developer account to access the inference infrastructure.

### Step 2: Generate Authentication Tokens
Navigate to the [API Keys section](https://console.groq.com/keys) and provision a new API token. Store this token immediately in a secure secrets manager, as the cleartext string will only be displayed upon initial generation.

### Step 3: Inject Token into Environment Constraints
Initialize the environment configuration file within the application server's root directory. Duplicate the provided template (`backend/.env.example`) to `backend/.env` and inject the newly generated API token:

```
GROQ_API_KEY=your_secure_api_key_here
```

### Step 4: Verification of Bootstrapping
Upon application initialization, the `app.py` entrypoint automatically resolves and injects the token into the runtime using `python-dotenv`:

```python
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
```

### Security Posture & Fallback Capabilities

**Credential Hygiene:** Do not commit the `.env` file to version control under any circumstances. It is explicitly ignored via the repository's `.gitignore` policy to prevent credential leakage.

> [!NOTE]
> **Ephemeral Fallback Architecture (Demo Mode)**
> If the `GROQ_API_KEY` environmental constraint is null or malformed, the `/api/analyze-waste` endpoint automatically degrades gracefully, serving a static, pre-compiled diagnostic payload to ensure continuous platform availability during demonstration or disconnected operations.
