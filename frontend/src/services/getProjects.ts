import type { Project } from "../types/project";
import { apiRequest } from "./http";

async function getProjects (): Promise<Project[]> {
    const res: {deployments: Project[]} = await apiRequest(`/deploy/user/deployments`, {
        method: 'GET',
    })
    console.log("JNSJHSIH", res)
    return res.deployments
}

export default getProjects

//GET {{base_url}}/deploy/user/deployments