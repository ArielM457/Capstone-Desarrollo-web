import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al iniciar sesión');
      }
      const { token } = await res.json();
      login(token);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__card">
        <div className="login-page__brand">
          <span aria-hidden="true"></span>
          <h1>JULibrary</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="login-form__field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="1234"
              required
            />
          </div>
          {error && <p className="login-form__error" role="alert">{error}</p>}
          <button
            className="login-form__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}
