// src/services/deploy.ts
import { apiRequest } from "./http"

export type DeploymentStatus = "ACTIVE" | "STOPPED" | "DEPLOYING" | "ERROR"

export type Deployment = {
  subdomain: string
  description: string
  repoUrl: string
  status: DeploymentStatus
  publicUrl: string
  createdAt: string
  lastActivityAt: string
  templateId?: Template["id"]
}

interface Template {
  id: string
  name: string
  repoTemplateUrl: string
}

// In-memory list for now (porque tu backend aún no expone GET /deploy)
let deployments: Deployment[] = []

const BASE_LOCALHOST = "localhost" // si luego quieres userName.localhost, aquí lo ajustas

export type CreateDeploymentInput = {
  repoUrl: string
  subdomain: string
  description: string
  templateId?: Template["id"]
}

export async function createDeployment(input: CreateDeploymentInput): Promise<Deployment> {
  // 1) Llamamos al backend real
  await apiRequest<unknown>(
    "/deploy",
    {
      method: "POST",
      body: JSON.stringify({
        repoUrl: input.repoUrl,
        subdomain: input.subdomain,
        description: input.description,
      }),
    },
    true,
  )

  // 2) Creamos el modelo de frontend
  const now = new Date().toISOString()

  const deployment: Deployment = {
    subdomain: input.subdomain,
    description: input.description,
    repoUrl: input.repoUrl,
    status: "DEPLOYING", // luego lo puedes actualizar a ACTIVE
    publicUrl: `http://${input.subdomain}.${BASE_LOCALHOST}`,
    createdAt: now,
    lastActivityAt: now,
    templateId: input.templateId,
  }

  deployments = [...deployments, deployment]

  return deployment
}

export async function deleteDeployment(subdomain: string): Promise<void> {
  await apiRequest<void>(`/deploy/${encodeURIComponent(subdomain)}`, { method: "DELETE" }, true)

  deployments = deployments.filter((d) => d.subdomain !== subdomain)
}

export function getDeployments(): Deployment[] {
  return deployments
}

export function getDeploymentBySubdomain(subdomain: string): Deployment | undefined {
  return deployments.find((d) => d.subdomain === subdomain)
}

// opcional: para actualizar el estado una vez que sepas que el deploy terminó
export function setDeploymentStatus(subdomain: string, status: DeploymentStatus) {
  deployments = deployments.map((d) =>
    d.subdomain === subdomain
      ? { ...d, status, lastActivityAt: new Date().toISOString() }
      : d,
  )
}
