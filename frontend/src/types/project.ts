export interface Project {
    userId: string;
    id: number;
    subdomain: string;
    description: string;
    repoUrl: string;
    createdAt: Date;
    lastAccess: Date;
    active: boolean;
}