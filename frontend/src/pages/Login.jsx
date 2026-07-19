import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { logIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await logIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message?.replace("Firebase: ", "") || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message?.replace("Firebase: ", "") || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌳</div>
          <h1 className="font-condensed font-bold text-3xl text-text-primary transition-colors">
            EcoSprout <span className="text-accent">AI</span>
          </h1>
          <p className="text-text-muted text-sm mt-2 font-mono transition-colors">
            Dispose Smart. Recycle Right.
          </p>
        </div>

        <div className="bg-bg-surface border border-border-color rounded-xl p-6 shadow-sm transition-colors">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-bg-surface-hover border border-border-color text-text-primary text-sm focus:outline-none focus:border-accent shadow-inner transition-colors"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-bg-surface-hover border border-border-color text-text-primary text-sm focus:outline-none focus:border-accent shadow-inner transition-colors"
            />
            {error && <p className="text-danger text-xs font-mono transition-colors">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent text-white font-bold text-sm transition-colors hover:bg-accent-hover disabled:opacity-60 shadow-sm"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-border-color flex-1 transition-colors" />
            <span className="text-text-muted text-xs font-mono transition-colors">OR</span>
            <div className="h-px bg-border-color flex-1 transition-colors" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-bg-surface border border-border-color hover:bg-bg-surface-hover text-text-primary font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.133C18.317 2.052 15.538 1 12.24 1s-10 4.03-10 9 4.03 9 10 9c6.24 0 10.413-4.39 10.413-10.59 0-.71-.077-1.25-.173-1.785H12.24z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
