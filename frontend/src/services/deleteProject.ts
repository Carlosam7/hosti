//http://localhost:3000/deploy/{{subdomain}}

import { apiRequest } from "./http";

async function deleteProject (subdomain: string) {
    const res: any = await apiRequest(`/deploy/${subdomain}`, {
        method: 'DELETE',
    })

    const data = await res.json()
    if (!res.ok) {
        return {
            success: false,
            message: `No fue posible eliminar el proyecto: ${data.message}`,
        }
    }
    return {
        success: true,
        message: 'Se eliminó el proyecto.'
    }
}

export default deleteProject