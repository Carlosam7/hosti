import { useEffect, useMemo, useState, type JSX } from "react"
import { createDeployment } from "../services/deploy"

type Step = 1 | 2 | 3

type Template = {
    id: string
    name: string
    description: string
    repoTemplateUrl: string
    slug: string
    icon: JSX.Element
    accent: string
    iconBg: string
}

const TEMPLATES: Template[] = [
    {
        id: "static-site",
        name: "Sitio Estático",
        description: "Sitio HTML/CSS/JS ideal para landings, portafolios y documentación.",
        repoTemplateUrl: "https://github.com/Judithpc23/hosting-template-static",
        slug: "static",
        icon: <span className="text-xl">🌐</span>,
        accent: "emerald",
        iconBg: "bg-emerald-100 text-emerald-600"
    },
    {
        id: "react",
        name: "React (Vite)",
        description: "Aplicación React moderna con Vite y HMR, optimizada para rendimiento.",
        repoTemplateUrl: "https://github.com/Judithpc23/hosting-template-react",
        slug: "react",
        icon: <span className="text-xl">⚛️</span>,
        accent: "indigo",
        iconBg: "bg-indigo-100 text-indigo-600"
    },
    {
        id: "flask",
        name: "Flask API",
        description: "Backend Flask listo para APIs REST y lógica en el servidor.",
        repoTemplateUrl: "https://github.com/Judithpc23/hosting-template-flask",
        slug: "flask",
        icon: <span className="text-xl">🐍</span>,
        accent: "cyan",
        iconBg: "bg-cyan-100 text-cyan-600"
    },
]


// Reemplaza esto con datos reales de usuario cuando añadas auth
const mockUser = { username: "usuario" }

const getApiBaseUrl = () => {
    const base = import.meta.env.VITE_API_URL?.trim()
    if (base) {
        return base.replace(/\/$/, "")
    }
    if (typeof window !== "undefined") {
        return window.location.origin.replace(/\/$/, "")
    }
    return ""
}

export default function NewProject() {
  const [step, setStep] = useState<Step>(1)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [user, setUser] = useState(null);

  // Validaciones
  const PROJECT_RE = /^(?!-)(?!.*--)[a-z0-9-]{3,32}(?<!-)$/ // minúsculas, números y -, sin guiones al inicio/fin ni dobles
  const GITHUB_URL_RE = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/

  const projectError =
    projectName.trim().length === 0
      ? null
      : PROJECT_RE.test(projectName.trim())
        ? null
        : "Usa 3–32 caracteres, solo minúsculas, números y guiones. Sin guiones al inicio/fin ni dobles."

  const repoError =
    repoUrl.trim().length === 0
      ? null
      : GITHUB_URL_RE.test(repoUrl.trim())
        ? null
        : "Debe ser una URL de GitHub válida, por ejemplo: https://github.com/usuario/repositorio"

  const canSubmit = projectName.trim() !== "" && repoUrl.trim() !== "" && !projectError && !repoError

  const selectedTemplate = useMemo(
      () => TEMPLATES.find((t) => t.id === selectedTemplateId) ?? null,
      [selectedTemplateId]
  )

  const canProceedStep1 = selectedTemplateId !== null

  const handleNext = () => {
      if (step < 3) setStep((step + 1) as Step)
  }

  const handleBack = () => {
      if (step > 1) setStep((step - 1) as Step)
  }

  const handleSubmit = async () => {
      if (!selectedTemplateId || !projectName || !repoUrl) return

      setIsCreating(true)
      setError(null)

      try {
          const deployment = await createDeployment(
            {
              repoUrl: repoUrl.trim(),
              subdomain: projectName.trim(),
              description: selectedTemplate?.description ?? "",
              templateId: selectedTemplateId,
            }
          )

          window.location.assign(deployment.publicUrl)
      } catch (err) {
          const message =
              err instanceof Error ? err.message : "Error al crear el proyecto. Inténtalo de nuevo."
          setError(message)
      } finally {
          setIsCreating(false)
      }
  }

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  return (
    <div className="flex flex-col justify-center w-full h-screen bg-[#f8f8f8] overflow-hidden">
      {/* Hero con gradiente igual al dashboard */}
      <section className="relative w-full pt-8 pb-4">
        <h1 className="mt-4 text-2xl md:text-4xl font-bold text-center text-gray-900">
          Crea tu proyecto con
          <span className="ml-2 px-3 md:px-5 rounded-xl text-white bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf]">
            Hosti
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 text-center">
          Selecciona una plantilla, conecta tu repositorio y despliega automáticamente.
        </p>
      </section>

      <main className="px-6 pb-4">
        {/* Stepper con acento turquesa */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                    s < step
                      ? "border-[#2dd4cf] bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf] text-white shadow-sm"
                      : s === step
                          ? "border-[#2dd4cf] bg-[#2dd4cf22] text-[#008781]"
                          : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 3 && <div className={`mx-2 h-0.5 w-14 ${s < step ? "bg-[#2dd4cf]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Paso 1: tarjetas estilo dashboard */}
          {step === 1 && (
            <div>
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold text-gray-900">Selecciona una plantilla</h2>
                <p className="mt-1 text-sm text-gray-600">Elige la tecnología para tu proyecto</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {TEMPLATES.map((t) => {
                  const selected = selectedTemplateId === t.id
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplateId(t.id)}
                      className={[
                        "group relative flex flex-col text-left rounded-2xl p-5 transition shadow-sm",
                        selected ? "border-2 border-[#2dd4cf] bg-[#eafaf9]" : "border border-gray-200 bg-white hover:shadow-md"
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium",
                          selected
                              ? "border-[#2dd4cf] bg-[#2dd4cf] text-white"
                              : "border-gray-300 bg-gray-100 text-gray-400"
                        ].join(" ")}
                      >
                        {selected ? "✓" : ""}
                      </span>

                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${t.iconBg}`}>
                        {t.icon}
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900">{t.name}</h3>
                      <p className="mt-0.5 text-xs font-mono lowercase text-gray-500">{t.slug}</p>
                      <p className="mt-3 text-xs text-gray-600 leading-relaxed">{t.description}</p>

                      <div className="mt-4">
                        <a
                          type="button"
                          onClick={(e) => { e.stopPropagation(); window.open(t.repoTemplateUrl, "_blank") }}
                          className={[
                            "flex items-center justify-center w-full gap-2 rounded-lg border text-xs font-medium py-2",
                            selected
                                ? "border-[#2dd4cf] bg-[#dff7f5] text-[#046a67] hover:bg-[#c9f0ed]"
                                : "border-gray-300 hover:border-[#2dd4cf] hover:bg-[#f1fbfa] text-gray-700"
                          ].join(" ")}
                        >
                          <span className="text-[13px]">Ver plantilla</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            className={`h-4 w-4 ${selected ? "text-[#046a67]" : "text-gray-700"}`}
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <path d="M15 3h6v6" />
                            <path d="M10 14 21 3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className={`btn btn-primary h-[42px] w-[160px] rounded-xl ${!canProceedStep1 ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: card con borde turquesa como dashboard */}
          {step === 2 && (
            <div>
              <div className="rounded-2xl border border-[#2dd4cf] bg-white shadow-sm">
                <div className="p-5">
                  <div className="mb-3">
                    <div className="text-lg font-semibold text-gray-900">Configura tu repositorio</div>
                    <div className="text-sm text-gray-600">Sigue estos pasos para crear tu repositorio a partir de la plantilla</div>
                  </div>

                  <ol className="space-y-5">
                    {[1,2,3,4].map((n, idx) => (
                      <li key={n} className="flex gap-4 items-start">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf] text-white text-sm font-medium">
                          {n}
                        </div>
                        <div>
                          {idx === 0 && (
                            <>
                              <h3 className="font-medium text-gray-900">Abre la plantilla en GitHub</h3>
                              <p className="mt-1 text-sm text-gray-600">Haz clic para abrir la plantilla {selectedTemplate?.name} en GitHub</p>
                              <button
                                className="mt-1 btn btn-outline p-1 rounded-lg text-xs"
                                onClick={() => selectedTemplate && window.open(selectedTemplate.repoTemplateUrl, "_blank")}
                              >
                                <div className="flex items-center justify-center w-full gap-2">
                                  Abrir plantilla
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <path d="M15 3h6v6" />
                                    <path d="M10 14 21 3" />
                                  </svg>
                                </div>
                              </button>
                            </>
                          )}
                          {idx === 1 && (
                            <>
                              <h3 className="font-medium text-gray-900">Usa esta plantilla</h3>
                              <p className="mt-1 text-sm text-gray-600">Haz clic en “Use this template” y selecciona “Create a new repository”.</p>
                            </>
                          )}
                          {idx === 2 && (
                            <>
                              <h3 className="font-medium text-gray-900">Crea tu repositorio</h3>
                              <p className="mt-1 text-sm text-gray-600">Elige un nombre y créalo. Asegúrate de que sea público o da acceso.</p>
                            </>
                          )}
                          {idx === 3 && (
                            <>
                              <h3 className="font-medium text-gray-900">Copia la URL del repositorio</h3>
                              <p className="mt-1 text-sm text-gray-600">La necesitarás en el siguiente paso.</p>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={handleBack} className="btn btn-outline rounded-xl">← Atrás</button>
                <button onClick={handleNext} className="btn btn-primary h-[42px] w-[160px] rounded-xl">Continuar →</button>
              </div>
            </div>
          )}

          {/* Paso 3: card y botones con el mismo acento */}
          {step === 3 && (
            <div>
              <div className="rounded-2xl border border-[#2dd4cf] bg-white shadow-sm">
                <div className="p-5 space-y-4 overflow-y-auto pr-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">Detalles del proyecto</div>
                    <div className="text-sm text-gray-600">Introduce la información de tu proyecto para completar la configuración</div>
                  </div>

                  {selectedTemplate && (
                    <div className="rounded-xl border border-[#c9f0ed] bg-[#f1fbfa] p-1 pl-2 flex items-center">
                      <p className="text-xs font-medium text-gray-900">Plantilla seleccionada: {selectedTemplate.name}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="projectName" className="text-sm font-medium text-gray-900">Nombre del proyecto</label>
                    <input
                      id="projectName"
                      placeholder="mi-proyecto-genial"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 font-mono focus:outline-none focus:ring-2
                        ${projectError ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#2dd4cf]"}`}
                    />
                    <p className={`text-xs ${projectError ? "text-red-600" : "text-gray-600"}`}>
                      {projectError || "Usa solo minúsculas, números y guiones"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="repoUrl" className="text-sm font-medium text-gray-900">URL del repositorio</label>
                    <input
                      id="repoUrl"
                      placeholder="https://github.com/usuario/nombre-repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 font-mono focus:outline-none focus:ring-2
                        ${repoError ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#2dd4cf]"}`}
                    />
                    <p className={`text-xs ${repoError ? "text-red-600" : "text-gray-600"}`}>
                      {repoError || "La URL completa de tu repositorio de GitHub"}
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-300 bg-red-50 p-2">
                      <p className="text-xs text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={handleBack} disabled={isCreating} className="btn btn-outline rounded-xl">← Atrás</button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isCreating}
                  className={`btn btn-primary h-[42px] w-[180px] rounded-xl ${!canSubmit || isCreating ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {isCreating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creando...
                    </>
                  ) : (
                    <>Crear y desplegar</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
