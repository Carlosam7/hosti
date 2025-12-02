import type { Project } from "../types/project";
import { apiRequest } from "./http";

async function getProjects (): Promise<Project[]> {
    const res: {deployments: Project[]} = await apiRequest(`/deploy/user/deployments`, {
        method: 'GET',
    })

    return res.deployments
}

export default getProjects

//GET {{base_url}}/deploy/user/deployments