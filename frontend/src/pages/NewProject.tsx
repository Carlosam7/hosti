import { useEffect, useMemo, useState } from "react"

type Step = 1 | 2 | 3

type Template = {
  id: string
  name: string
  description: string
  repoTemplateUrl: string
}

const TEMPLATES: Template[] = [
  {
    id: "react-vite",
    name: "React + Vite",
    description: "Plantilla frontend con React 19 y Vite 7",
    repoTemplateUrl: "https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react",
  },
  {
    id: "node-express",
    name: "Node + Express",
    description: "Plantilla backend con Express 5",
    repoTemplateUrl: "https://github.com/expressjs/express",
  },
  {
    id: "static-site",
    name: "Sitio estático",
    description: "Sitio estático simple servido con Nginx",
    repoTemplateUrl: "https://github.com/nginx/nginx",
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

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedTemplateId) ?? null,
    [selectedTemplateId]
  )

  const previewUrl =
    projectName && mockUser
      ? `http://${projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}.${mockUser.username}.localhost`
      : null

  const canProceedStep1 = selectedTemplateId !== null
  const canProceedStep2 = true
  const canSubmit = projectName.trim() !== "" && repoUrl.trim() !== ""

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
      const response = await fetch(`${getApiBaseUrl()}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          subdomain: projectName.trim(),
          description: selectedTemplate?.description,
        }),
      })

      const data: { url?: string; message?: string } = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message || "Error al crear el proyecto. Inténtalo de nuevo.")
      }
      if (!data.url) {
        throw new Error("El despliegue se completó pero no se devolvió una URL.")
      }

      setIsCreating(false)
      window.location.assign(data.url)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear el proyecto. Inténtalo de nuevo."
      setError(message)
      setIsCreating(false)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <button
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            onClick={() => setStep(1)}
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold">Crear nuevo proyecto</h1>
          <p className="mt-1 text-muted-foreground">
            Despliega un proyecto web contenedor en tres pasos simples
          </p>
        </div>

        {/* Paso a paso */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    s < step
                      ? "border-primary bg-primary text-primary-foreground"
                      : s === step
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 3 && <div className={`mx-2 h-0.5 w-16 ${s < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <span className="text-sm font-medium">
              {step === 1 && "Elegir plantilla"}
              {step === 2 && "Instrucciones de configuración"}
              {step === 3 && "Detalles del proyecto"}
            </span>
          </div>
        </div>

        {/* Contenido por paso */}
        <div className="mx-auto max-w-4xl">
          {/* Paso 1: Elegir plantilla */}
          {step === 1 && (
            <div>
              <div className="mb-6 text-center">
                <h2 className="text-lg font-semibold">Selecciona una plantilla</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Elige la tecnología para tu proyecto
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {TEMPLATES.map((template) => {
                  const selected = selectedTemplateId === template.id
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`rounded-lg border p-4 text-left transition ${
                        selected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                      <div className="mt-3 text-xs text-primary underline">
                        Abrir plantilla
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className={`button inline-flex items-center gap-2 rounded-md px-4 py-2 ${
                    canProceedStep1
                      ? "bg-primary text-primary-foreground hover:brightness-110"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Instrucciones */}
          {step === 2 && (
            <div>
              <div className="rounded-lg border border-border bg-card">
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-lg font-semibold">Configura tu repositorio</div>
                    <div className="text-sm text-muted-foreground">
                      Sigue estos pasos para crear tu repositorio a partir de la plantilla
                    </div>
                  </div>

                  <ol className="space-y-6">
                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium">Abre la plantilla en GitHub</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Haz clic para abrir la plantilla {selectedTemplate?.name} en GitHub
                        </p>
                        <button
                          className="mt-3 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
                          onClick={() => selectedTemplate && window.open(selectedTemplate.repoTemplateUrl, "_blank")}
                        >
                          Abrir plantilla {selectedTemplate?.name} ↗
                        </button>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium">Usa esta plantilla</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Haz clic en el botón verde “Use this template” y selecciona “Create a new repository”.
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium">Crea tu repositorio</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Elige un nombre y créalo en tu cuenta de GitHub. Asegúrate de que sea público o concede acceso a tu sistema.
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium">Copia la URL del repositorio</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Copia la URL de tu nuevo repositorio. La necesitarás en el siguiente paso.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Detalles del proyecto */}
          {step === 3 && (
            <div>
              <div className="rounded-lg border border-border bg-card">
                <div className="p-6 space-y-6">
                  <div>
                    <div className="text-lg font-semibold">Detalles del proyecto</div>
                    <div className="text-sm text-muted-foreground">
                      Introduce la información de tu proyecto para completar la configuración
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="projectName" className="text-sm font-medium">Nombre del proyecto</label>
                    <input
                      id="projectName"
                      placeholder="mi-proyecto-genial"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Usa solo minúsculas, números y guiones
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="repoUrl" className="text-sm font-medium">URL del repositorio</label>
                    <input
                      id="repoUrl"
                      placeholder="https://github.com/usuario/nombre-repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono"
                    />
                    <p className="text-xs text-muted-foreground">La URL completa de tu repositorio de GitHub</p>
                  </div>

                  {previewUrl && (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <p className="text-sm font-medium">La URL de tu proyecto será:</p>
                      <code className="mt-2 block rounded bg-card px-3 py-2 font-mono text-sm text-primary">
                        {previewUrl}
                      </code>
                    </div>
                  )}

                  {selectedTemplate && (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div>
                        <p className="text-sm font-medium">Plantilla: {selectedTemplate.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isCreating}
                  className={`button inline-flex items-center gap-2 rounded-md px-4 py-2 ${
                    !canSubmit || isCreating
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:brightness-110"
                  }`}
                >
                  {isCreating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Creando...
                    </>
                  ) : (
                    <>🚀 Crear y desplegar</>
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
