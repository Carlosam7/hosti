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

    const selectedTemplate = useMemo(
        () => TEMPLATES.find((t) => t.id === selectedTemplateId) ?? null,
        [selectedTemplateId]
    )

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
            const deployment = await createDeployment({
                repoUrl: repoUrl.trim(),
                subdomain: projectName.trim(),
                description: selectedTemplate?.description ?? "",
                templateId: selectedTemplateId,
            })

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
        <div className="w-full pt-[70px] h-[calc(100vh-70px)] bg-[#f8f8f8] overflow-hidden">
            <section className="relative flex flex-col items-center w-full pt-6 pb-4">
                <h1 className="text-2xl md:text-4xl font-bold text-center">
                    Crea tu proyecto con
                    <span className="ml-2 px-3 md:px-5 bg-linear-to-tr from-[#00ffaa] to-[#008781] rounded-xl text-white">
                        Hosti
                    </span>
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-600 text-center">
                    Selecciona una plantilla, conecta tu repositorio de GitHub y despliega automáticamente.
                </p>
            </section>

            {/* Área principal: sin scroll de página, el contenido se ajusta y recorta si excede */}
            <main className="mx-auto max-w-5xl px-4 pb-4 h-[calc(100%-120px)]">
                {/* Stepper */}
                <div className="mb-6 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors
                  ${s < step
                                            ? "border-[#00ffaa] bg-linear-to-tr from-[#00ffaa] to-[#008781] text-white"
                                            : s === step
                                                ? "border-[#00ffaa] bg-[#00ffaa20] text-[#008781]"
                                                : "border-gray-200 bg-white text-gray-400"
                                        }`}
                                >
                                    {s < step ? "✓" : s}
                                </div>
                                {s < 3 && (
                                    <div className={`mx-2 h-0.5 w-12 ${s < step ? "bg-[#00ffaa]" : "bg-gray-200"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contenido por paso */}
                <div className="mx-auto max-w-4xl">
                    {/* Paso 1 */}
                    {step === 1 && (
                        <div>
                            <div className="mb-4 text-center">
                                <h2 className="text-lg font-semibold text-gray-900">Selecciona una plantilla</h2>
                                <p className="mt-1 text-sm text-gray-600">Elige la tecnología para tu proyecto</p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                {TEMPLATES.map((t) => {
                                    const selected = selectedTemplateId === t.id
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTemplateId(t.id)}
                                            className={[
                                                "group relative flex flex-col text-left rounded-2xl border p-5 transition",
                                                "focus:outline-none focus:ring-2 focus:ring-blue-400",
                                                selected
                                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                                            ].join(" ")}
                                        >
                                            {/* Check en esquina si está seleccionado */}
                                            <span
                                                className={[
                                                    "absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium",
                                                    selected
                                                        ? "border-blue-500 bg-blue-500 text-white"
                                                        : "border-gray-300 bg-gray-100 text-gray-400 group-hover:text-blue-500 group-hover:border-blue-300"
                                                ].join(" ")}
                                            >
                                                {selected ? "✓" : ""}
                                            </span>

                                            {/* Icono */}
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${t.iconBg}`}>
                                                {t.icon}
                                            </div>

                                            {/* Título */}
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {t.name}
                                            </h3>

                                            {/* Slug */}
                                            <p className="mt-0.5 text-xs font-mono lowercase text-gray-500">
                                                {t.slug}
                                            </p>

                                            {/* Descripción */}
                                            <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                                                {t.description}
                                            </p>

                                            {/* Botón ver plantilla */}
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        window.open(t.repoTemplateUrl, "_blank")
                                                    }}
                                                    className={[
                                                        "flex items-center justify-center w-full gap-2 rounded-lg border text-xs font-medium py-2",
                                                        selected
                                                            ? "border-blue-400 bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700"
                                                    ].join(" ")}
                                                >
                                                    <span className="text-[13px]">Ver plantilla</span>
                                                    {/* Ícono de enlace externo (SVG) */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className={`h-4 w-4 ${selected ? "text-blue-700" : "text-gray-700 group-hover:text-blue-600"
                                                            }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <path d="M15 3h6v6" />
                                                        <path d="M10 14 21 3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceedStep1}
                                    className={`btn btn-primary h-[42px] w-[150px] rounded-xl transform transition-all duration-300 ${!canProceedStep1
                                            ? "opacity-60 cursor-not-allowed"
                                            : "hover:shadow-[0_0_30px_0px_#00ffaa] hover:scale-105"
                                        }`}
                                >
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paso 2 */}
                    {step === 2 && (
                        <div>
                            <div className="rounded-2xl border border-[#00ffaa] bg-white shadow-sm">
                                <div className="p-5">
                                    <div className="mb-3">
                                        <div className="text-lg font-semibold text-gray-900">Configura tu repositorio</div>
                                        <div className="text-sm text-gray-600">
                                            Sigue estos pasos para crear tu repositorio a partir de la plantilla
                                        </div>
                                    </div>

                                    <ol className="space-y-5">
                                        <li className="flex gap-4 items-start">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-[#00ffaa] to-[#008781] text-white text-sm font-medium">
                                                1
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Abre la plantilla en GitHub</h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Haz clic para abrir la plantilla {selectedTemplate?.name} en GitHub
                                                </p>
                                                <button
                                                    className="mt-2 btn btn-outline"
                                                    onClick={() => selectedTemplate && window.open(selectedTemplate.repoTemplateUrl, "_blank")}
                                                >
                                                    <div className="flex items-center justify-center w-full gap-2">
                                                    Abrir plantilla 
                                                    {/* Ícono de enlace externo (SVG) */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className={`h-4 w-4 text-gray-700 group-hover:text-blue-600
                                                            }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <path d="M15 3h6v6" />
                                                        <path d="M10 14 21 3" />
                                                    </svg>
                                                    </div>
                                                </button>
                                            </div>
                                        </li>

                                        <li className="flex gap-4 items-start">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-[#00ffaa] to-[#008781] text-white text-sm font-medium">
                                                2
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Usa esta plantilla</h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Haz clic en el botón verde “Use this template” y selecciona “Create a new repository”.
                                                </p>
                                            </div>
                                        </li>

                                        <li className="flex gap-4 items-start">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-[#00ffaa] to-[#008781] text-white text-sm font-medium">
                                                3
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Crea tu repositorio</h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Elige un nombre y créalo en tu cuenta de GitHub. Asegúrate de que sea público o concede acceso a tu sistema.
                                                </p>
                                            </div>
                                        </li>

                                        <li className="flex gap-4 items-start">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-[#00ffaa] to-[#008781] text-white text-sm font-medium">
                                                4
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Copia la URL del repositorio</h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Copia la URL de tu nuevo repositorio. La necesitarás en el siguiente paso.
                                                </p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between">
                                <button onClick={handleBack} className="btn btn-outline rounded-xl">← Atrás</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceedStep2}
                                    className="btn btn-primary h-[42px] w-[150px] rounded-xl hover:shadow-[0_0_30px_0px_#00ffaa] transform hover:scale-105 transition-all duration-300"
                                >
                                    Continuar →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paso 3 */}
                    {step === 3 && (
                        <div>
                            <div className="rounded-2xl border border-[#00ffaa] bg-white shadow-sm">
                                <div className="p-5 space-y-4 overflow-y-auto pr-4 scroll-auto">

                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">Detalles del proyecto</div>
                                        <div className="text-sm text-gray-600">
                                            Introduce la información de tu proyecto para completar la configuración
                                        </div>
                                    </div>

                                    {selectedTemplate && (
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-center">
                                            <div>
                                                <p className="text-xs font-medium text-gray-900">Plantilla Seleccionada: {selectedTemplate.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label htmlFor="projectName" className="text-sm font-medium text-gray-900">Nombre del proyecto</label>
                                        <input
                                            id="projectName"
                                            placeholder="mi-proyecto-genial"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ffaa]"
                                        />
                                        <p className="text-xs text-gray-600">Usa solo minúsculas, números y guiones</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="repoUrl" className="text-sm font-medium text-gray-900">URL del repositorio</label>
                                        <input
                                            id="repoUrl"
                                            placeholder="https://github.com/usuario/nombre-repo"
                                            value={repoUrl}
                                            onChange={(e) => setRepoUrl(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ffaa]"
                                        />
                                        <p className="text-xs text-gray-600">La URL completa de tu repositorio de GitHub</p>
                                    </div>


                                    {error && (
                                        <div className="rounded-xl border border-red-400 bg-red-50 p-2">
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
                                    className={`btn btn-primary h-[42px] w-[180px] rounded-xl transform transition-all duration-300
                    ${!canSubmit || isCreating ? "opacity-60 cursor-not-allowed" : "hover:shadow-[0_0_30px_0px_#00ffaa] hover:scale-105"}`}
                                >
                                    {isCreating ? (
                                        <>
                                            <div className=" h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
