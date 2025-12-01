import { useState } from "react";
import { login } from "../services/auth";
// Icons
import { FaGithub } from "react-icons/fa";
import { TbDatabaseImport } from "react-icons/tb";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);
      console.log("Login OK:", res);

      // REDIRECT AL DASHBOARD
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br bg-size-[400%_400%] animate-gradientShift p-4">
      <section aria-label="Autenticación" className="flex w-full max-w-4xl bg-white/95 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">

        {/* LEFT PANEL */}
        <aside className="hidden md:flex flex-col justify-center items-center flex-1 bg-linear-to-r from-teal-700 to-teal-400 p-10 relative overflow-hidden text-white">
          <div className="absolute w-72 h-72 bg-white/20 rounded-full -top-20 -right-20 animate-float" aria-hidden="true" />
          <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-16 -left-16 animate-float" aria-hidden="true" />

          <div className="text-6xl mb-4" aria-hidden="true"></div>
          <h2 className="text-3xl font-bold mb-4 text-center">Hosting Platform</h2>
          <p className="text-center opacity-90">Despliega tus proyectos web en segundos con contenedores Docker</p>

          <ul className="mt-8 space-y-4" aria-label="Características">
            <Feature icon={<FaGithub />} text="Despliegue instantáneo desde GitHub" />
            <Feature icon={<TbDatabaseImport />} text="Integración segura con Roble" />
            <Feature icon="📊" text="Monitoreo en tiempo real" />
          </ul>
        </aside>

        {/* RIGHT PANEL */}
        <section className="flex-1 p-10" aria-label="Formulario de inicio de sesión">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-teal-700">Bienvenido de nuevo</h1>
            <p className="text-gray-500 text-sm">Ingresa tus credenciales para continuar</p>
          </header>

          {error && (
            <div role="alert" className="mb-6 text-sm rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-teal-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true">📧</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tu@uninorte.edu.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 p-3 bg-white rounded-lg border-2 border-gray-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-300/30 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-teal-700 mb-1">Contraseña</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true">🔑</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 p-3 bg-white rounded-lg border-2 border-gray-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-300/30 transition"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full p-3 rounded-lg bg-linear-to-br from-teal-500 to-teal-400 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="my-6 flex items-center" aria-hidden="true">
          </div>

          <button
            type="button"
            aria-label="Terminos y condiciones de uso de Roble"
            className="w-full p-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition"
          >
            Terminos y condiciones de uso de Roble
          </button>
        </section>
      </section>
    </main>
  );
}

function Feature({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl text-lg" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm">{text}</span>
    </li>
  );
}
