# Hosti - Plataforma de Hosting y Despliegue Automático

Hosti es una plataforma web que permite desplegar proyectos desde repositorios de GitHub de manera automática utilizando contenedores Docker. La plataforma gestiona recursos, proporciona subdominios únicos para cada proyecto y cuenta con un sistema de apagado automático de contenedores inactivos para optimizar el uso de recursos.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Enlaces Requeridos](#-enlaces-requeridos)
- [Arquitectura y Componentes](#-arquitectura-y-componentes)
- [Informe Técnico Detallado](#-informe-técnico-detallado)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Contribución](#-contribución)

## ✨ Características

- **Autenticación**: Integración con Roble para registro e inicio de sesión
- **Despliegue Automático**: Clonado de repositorios desde GitHub y construcción automática de contenedores Docker
- **Gestión de Recursos**: Límites de CPU y memoria por contenedor (0.5 CPU, 250MB RAM por defecto)
- **Apagado Automático**: Sistema de monitoreo que detiene contenedores inactivos después de un período de tiempo configurable
- **Reverse Proxy**: Nginx como proxy inverso con configuración dinámica de subdominios
- **Dashboard Intuitivo**: Interfaz web moderna y responsive para gestionar proyectos

## 🔗 Enlaces Requeridos

### 1. Repositorios de Templates Dockerizados

Estos son los templates listos para **"Use this template"** desde GitHub.  
Cada uno incluye su **Dockerfile funcional**, respetando el estándar de despliegue de la plataforma.

| Tipo de plantilla | Repositorio | Descripción |
|------------------|-------------|-------------|
| **React (Vite)** | https://github.com/Judithpc23/hosting-template-react | Template moderno para SPAs, dashboards e interfaces interactivas. |
| **Flask (Python)** | https://github.com/Edadul/hosti-template-flask | Backend con Flask 5 listo para exponer APIs o vistas dinámicas. |
| **Sitio estático** | https://github.com/Judithpc23/hosting-template-static | HTML/CSS/JS servido con Nginx. Ideal para landings, portafolios o documentación. |


### 2. Video de Demostración en YouTube

[🔗 Ver Video de Demostración](https://youtu.be/372x2iv2-ys)

El video de demostración incluye:
- **Registro e inicio de sesión**: Proceso completo de autenticación con Roble
- **Creación y despliegue de un proyecto**: Flujo completo desde la selección de template hasta el despliegue
- **La gestión de recursos y apagado automático**: Demostración del sistema de monitoreo y apagado de contenedores inactivos


## 🏗️ Arquitectura y Componentes

### Descripción General

Hosti está diseñada como una aplicación full-stack con arquitectura de microservicios, utilizando Docker para la containerización y orquestación. La plataforma se compone de tres componentes principales:

1. **Frontend**: Aplicación React con TypeScript que proporciona la interfaz de usuario
2. **Backend**: API REST construida con Express.js y TypeScript que gestiona la lógica de negocio
3. **Nginx**: Servidor web y reverse proxy que enruta las peticiones a los contenedores de los proyectos

### Componentes Principales

#### Frontend

- **Framework**: React 19 con TypeScript
- **Routing**: React Router DOM para navegación
- **Estilos**: Tailwind CSS 4
- **Estado**: Context API para gestión de autenticación
- **Componentes Principales**:
  - `LandingPage`: Página de inicio con información de la plataforma
  - `Login`: Página de autenticación (registro e inicio de sesión)
  - `Dashboard`: Panel principal para gestionar proyectos
  - `NewProject`: Formulario para crear y desplegar nuevos proyectos
  - `ViewProjects`: Vista de lista de proyectos desplegados

#### Backend

El backend está estructurado en módulos siguiendo el patrón de arquitectura por capas:

**Módulos Principales**:

1. **Auth Module** (`src/auth/`)
   - Gestión de autenticación y autorización
   - Integración con Roble para validación de tokens
   - Middleware de autenticación para proteger rutas
   - Servicios: `AuthService`, `TokenService`, `AuthManagerService`

2. **Deploy Module** (`src/deploy/`)
   - Gestión del ciclo de vida de los despliegues
   - Clonado de repositorios desde GitHub
   - Construcción y ejecución de contenedores Docker
   - Configuración de reverse proxy
   - Servicios: `DeployManagerService`, `DeployRollbackService`

3. **Monitor Module** (`src/monitor/`)
   - Worker de monitoreo de contenedores inactivos
   - Actualización de timestamps de último acceso
   - Lógica de apagado automático

4. **Services** (`src/services/`)
   - `DockerService`: Interfaz para operaciones con Docker (build, run, stop, remove)
   - `GitService`: Clonado y gestión de repositorios Git
   - `ReverseProxyService`: Configuración dinámica de Nginx

5. **Database** (`src/db/`)
   - SQLite con Prisma ORM
   - Modelo de datos: `Deploy` (id, userId, subdomain, repoUrl, description, active, lastAccess, createdAt)
   - Repositorios para acceso a datos

**Flujo de Despliegue**:

1. Usuario crea un proyecto desde el frontend
2. Backend valida autenticación y datos del proyecto
3. Se clona el repositorio de GitHub en un directorio temporal
4. Se construye la imagen Docker del proyecto
5. Se crea y ejecuta el contenedor con límites de recursos
6. Se configura Nginx con un subdominio único (`{proyecto}.{usuario}.localhost`)
7. Se registra el despliegue en la base de datos
8. El contenedor queda disponible en su subdominio

**Sistema de Apagado Automático**:

- Worker que se ejecuta cada 30 segundos (configurable)
- Verifica contenedores activos en la base de datos
- Compara `lastAccess` con el tiempo actual
- Si un contenedor está inactivo por más de 120 segundos (configurable), se detiene automáticamente
- El contenedor puede ser reactivado automáticamente cuando se accede a su subdominio

#### Nginx (Reverse Proxy)

- Configuración dinámica mediante archivos `.conf` generados por el backend
- Cada proyecto obtiene un subdominio único: `{proyecto}.{usuario}.localhost`
- Proxy inverso hacia los contenedores Docker en puertos dinámicos
- Sistema de notificación de acceso mediante `auth_request` para actualizar `lastAccess`
- Recarga automática de configuración cuando se crean o eliminan proyectos

### Diagrama de Arquitectura

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│    http://localhost:5173 (dev)     │
└──────────────┬──────────────────────┘
               │
               │ HTTP Requests
               ▼
┌─────────────────────────────────────┐
│      Nginx (Reverse Proxy)          │
│         Port 80                     │
│  - Routing a contenedores           │
│  - Notificación de acceso           │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐  ┌─────────────┐
│   Backend   │  │  Contenedor │
│  (Express)  │  │  Proyecto 1 │
│  Port 3000  │  └─────────────┘
└──────┬──────┘
       │
       ├───► Docker API (Docker Socket)
       │     - Build images
       │     - Run/Stop containers
       │
       ├───► SQLite Database
       │     - Deployments metadata
       │
       ├───► GitHub API
       │     - Clone repositories
       │
       └───► Roble API
             - Authentication
```

### Gestión de Recursos

- **Límites por Contenedor**:
  - CPU: 0.5 cores (Definido en mi dockerFile)
  - Memoria: 250MB (Definido en mi dockerFile)
  - Red: Red Docker personalizada (`hosti_net`)

- **Optimización**:
  - Contenedores inactivos se detienen automáticamente
  - Los contenedores se reactivan bajo demanda cuando se accede a su subdominio
  - Monitoreo continuo del tiempo de inactividad
 
## 📄 Informe Técnico Detallado

Para una descripción más extensa del sistema, puedes consultar el documento técnico:

- **Informe técnico**: [`Informe tecnico.md`](Informe%20tecnico.md)

En este documento se detalla:
- **Descripción de la arquitectura y componentes** (frontend, backend, Nginx, base de datos y Docker).
- **Flujo de trabajo del sistema** (autenticación, creación y despliegue de proyectos, acceso y apagado automático).
- **Estrategia de seguridad y optimización de recursos** (autenticación, CORS, aislamiento lógico, límites de CPU/Memoria, apagado automático, etc.).


## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.2.0**: Biblioteca de UI
- **TypeScript 5.9.3**: Tipado estático
- **Vite 7.2.4**: Build tool y dev server
- **Tailwind CSS 4.1.17**: Framework de estilos
- **React Router DOM 6.30.2**: Enrutamiento
- **React Icons 5.5.0**: Iconos

### Backend
- **Node.js**: Runtime de JavaScript
- **Express 5.1.0**: Framework web
- **TypeScript 5.9.3**: Tipado estático
- **Prisma 6.19.0**: ORM para base de datos
- **SQLite**: Base de datos relacional
- **Zod 4.1.12**: Validación de esquemas
- **Axios 1.13.2**: Cliente HTTP
- **Docker**: Containerización y orquestación

### DevOps
- **Docker**: Containerización de aplicaciones
- **Docker Compose**: Orquestación de contenedores
- **Nginx**: Reverse proxy y servidor web

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Docker y Docker Compose
- Git

### Pasos de Instalación

1. **Clonar el repositorio**:
```bash
git clone <url-del-repositorio>
cd hosti
```

2. **Configurar variables de entorno**:

Crear archivo `.env` en `backend/`:
```env
PORT=3000
NODE_ENV=production
ROBLE_URL=<url-de-roble>
TOKEN_CONTRACT=<token-contract>
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:80
CORS_ALLOWED_DOMAINS=localhost
```

3. **Construir e iniciar contenedores**:
```bash
docker-compose up --build
```

4. **Ejecutar migraciones de base de datos** (si es necesario):
```bash
docker exec backend npx prisma migrate deploy
```

5. **Acceder a la aplicación**:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000

## ⚙️ Configuración

### Variables de Entorno del Backend

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor backend | 3000 |
| `NODE_ENV` | Entorno de ejecución | production |
| `ROBLE_URL` | URL del servicio Roble | - |
| `TOKEN_CONTRACT` | Contrato de token para Roble | - |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para CORS | http://localhost:3000 |
| `CORS_ALLOWED_DOMAINS` | Dominios permitidos para CORS | localhost |

### Configuración del Worker de Monitoreo

En `backend/src/shared/config/config.ts`:
- `workerCheckIntervalS`: Intervalo de verificación en segundos (default: 30)
- `workerInactivityThresholdS`: Umbral de inactividad en segundos (default: 120)

### Límites de Recursos Docker

En `backend/src/services/docker.service.ts`:
- CPU: `--cpus="0.5"` (Definido en mi dockerFile)
- Memoria: `--memory="250m"` (Definido en mi dockerFile)

## 🚀 Uso

### Registro e Inicio de Sesión

1. Acceder a la aplicación en http://localhost:80
2. Hacer clic en "Get Started" o navegar a `/login`
3. Seleccionar "Registrarse" o "Iniciar Sesión"
4. Ingresar credenciales de Roble
5. Ser redirigido al Dashboard

### Crear y Desplegar un Proyecto

1. Desde el Dashboard, hacer clic en "Nuevo Proyecto"
2. Completar el formulario:
   - Nombre del proyecto
   - URL del repositorio de GitHub
   - Descripción (opcional)
   - Template a utilizar
3. Hacer clic en "Desplegar"
4. Esperar a que se complete el proceso de despliegue
5. El proyecto estará disponible en `{proyecto}.{usuario}.localhost`

### Gestionar Proyectos

- **Ver proyectos**: Lista de todos los proyectos desplegados en el Dashboard
- **Eliminar proyecto**: Botón de eliminación que detiene y elimina el contenedor
- **Acceder al proyecto**: Hacer clic en el enlace del proyecto o visitar su subdominio

### Apagado Automático

- Los contenedores inactivos se detienen automáticamente después de 120 segundos sin actividad
- Al acceder a un contenedor detenido, se reactiva automáticamente
- El sistema actualiza el timestamp de último acceso en cada petición

## 📁 Estructura del Proyecto

```
hosti/
├── backend/
│   ├── src/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── deploy/            # Módulo de despliegue
│   │   ├── monitor/           # Worker de monitoreo
│   │   ├── services/          # Servicios (Docker, Git, ReverseProxy)
│   │   ├── db/                # Base de datos y repositorios
│   │   ├── shared/            # Utilidades compartidas
│   │   └── index.ts           # Punto de entrada
│   ├── prisma/                # Esquemas y migraciones
│   ├── nginx/                 # Configuración de Nginx
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas principales
│   │   ├── layouts/           # Layouts responsivos
│   │   ├── services/          # Servicios de API
│   │   ├── context/           # Context API
│   │   └── routes/            # Configuración de rutas
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Autenticación

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Obtener información del usuario actual

### Despliegues

- `POST /deploy` - Crear y desplegar un proyecto
- `DELETE /deploy/:projectName` - Eliminar un proyecto
- `GET /deploy` - Obtener todos los proyectos del usuario
- `POST /deploy/notify-access/:project` - Notificar acceso (interno)

## 📝 Licencia

Este proyecto es parte de un trabajo académico. Todos los derechos reservados.

## 👥 Integrantes del equipo

| Integrante | Rol | GitHub |
|-----------|------|--------|
| Esteban Dadul | Backend – Infraestructura – Docker, Compose, Proxy | [@Edadul](https://github.com/Edadul) |
| Judith Pérez | Frontend, integración y templates | [@Judithpc23](https://github.com/Judithpc23) |
| Carlos Arango | Frontend – Dashboard, UI/UX | [@Carlosam7](https://github.com/Carlosam7) |
| Andres Monserrat| Integración fullstack, testing | [@AndresMonserrat](https://github.com/AndresMonserrat) |
| Ivan Parra | Documentación, video y soporte de templates | [@ivanparra19](https://github.com/ivanparra19) |

---

