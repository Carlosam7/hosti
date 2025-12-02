## Informe Técnico - Hosti

### 1. Descripción de la arquitectura y componentes

#### 1.1 Visión general

Hosti es una plataforma de hosting académico que automatiza el despliegue de proyectos web a partir de repositorios de GitHub, utilizando contenedores Docker y un reverse proxy Nginx. La arquitectura sigue un enfoque **cliente–servidor** con un **frontend SPA** en React, un **backend RESTful** en Node/Express y un entorno de ejecución orquestado mediante **Docker Compose**.

Componentes principales:
- **Frontend** (`frontend/`): interfaz web donde el usuario se autentica, gestiona proyectos y lanza despliegues.
- **Backend** (`backend/`): API que centraliza la lógica de negocio, comunicación con Roble, GitHub, Docker y base de datos.
- **Nginx** (`backend/nginx/` + contenedor `nginx`): reverse proxy y punto de entrada HTTP a los proyectos desplegados.
- **Base de datos** (SQLite + Prisma): almacenamiento de metadatos de despliegues.
- **Docker Engine**: motor de contenedores que ejecuta los proyectos de los estudiantes.

La comunicación entre componentes se realiza principalmente vía HTTP:
- Frontend → Backend: peticiones REST (autenticación, creación de despliegues, listado, borrado, etc.).
- Nginx → Backend: peticiones internas para notificar accesos y actualizar la métrica `lastAccess`.
- Backend → Docker: comandos a través del socket de Docker (vía utilitario `exec`).
- Backend → GitHub/Roble: peticiones HTTP con Axios.

#### 1.2 Frontend (React + TypeScript)

El frontend está construido como una SPA (Single Page Application) con React y TypeScript, estructurado en varias capas:

- **Punto de entrada**
  - `src/main.tsx`: monta la aplicación React y envuelve el árbol con `BrowserRouter` (para rutas) y `AuthProvider` (contexto de autenticación).
  - `src/App.tsx`: define la estructura principal y delega la navegación en `AppRoutes`.

- **Rutas y navegación**
  - `src/routes/AppRoutes.tsx`: define las rutas principales (`/`, `/login`, `/dashboard`, `/new-project`, etc.).
  - `src/routes/ProtectedRoute.tsx`: componente que protege rutas que requieren usuario autenticado. Si no hay sesión válida, redirige a `/login`.
  - `src/routes/PublicRoute.tsx`: componente que restringe acceso a rutas públicas cuando el usuario ya está autenticado (por ejemplo, evita que un usuario logueado vuelva a `/login`).

- **Contexto de autenticación**
  - `src/context/AuthContext.tsx`: mantiene y expone el estado de autenticación:
    - Información del usuario autenticado (datos básicos obtenidos tras login).
    - Estado `isAuthenticated` para habilitar/ocultar secciones de la UI.
    - Funciones `login`, `logout` y recuperación de sesión (por ejemplo, a través de cookies o peticiones al backend).
  - El contexto se consume en componentes como `Navbar`, `LandingPageDesktop`, `DashboardDesktop` y `Login` para adaptar la experiencia según el estado de sesión.

- **Páginas principales**
  - `src/pages/LandingPage.tsx` / `src/layouts/desktop/LandingPageDesktop.tsx`:
    - Presentan la propuesta de valor de Hosti.
    - Botón principal para “Get Started” que redirige a `/login` o `/dashboard` según `isAuthenticated`.
    - Sección de explicación de pasos (seleccionar template, conectar repo, desplegar).
  - `src/pages/Login.tsx`:
    - Pantalla dividida en panel informativo y formulario (mejor experiencia en desktop).
    - Formulario con modo **login** / **registro** controlado por estado local.
    - Llama al servicio `auth.ts` para comunicarse con el backend.
  - `src/pages/Dashboard.tsx` / `src/layouts/desktop/DashboardDesktop.tsx`:
    - Muestra la lista de proyectos desplegados del usuario.
    - Incluye tarjetas (`CardProject`) con información como nombre, descripción, URL de acceso y acciones (eliminar, ver más detalles).
  - `src/pages/NewProject.tsx`:
    - Formulario para crear un nuevo despliegue:
      - Nombre del proyecto.
      - URL del repositorio.
      - Opcionalmente descripción y selección de template.
    - Llama al servicio `deploy.ts` del frontend que envía los datos al backend.

- **Componentes reutilizables**
  - `Navbar`: navegación principal, cambia su contenido según el estado de sesión (mostrar login, logout, dashboard, etc.).
  - `CardDashboard`, `CardProject`, `CardWelcome`, `landingPageCard`: tarjetas de UI para mostrar resúmenes, estados vacíos (`NoProject`), y acciones rápidas.
  - `ViewProjects`: componente que recibe la lista de despliegues y renderiza las tarjetas correspondientes.

- **Servicios de comunicación con el backend**
  - `src/services/http.ts`: centraliza la configuración base de Axios (URL del backend, credenciales/cookies, headers comunes).
  - `src/services/auth.ts`: funciones para login, registro, obtención de usuario actual y logout.
  - `src/services/deploy.ts`: funciones para crear un despliegue (POST `/deploy`).
  - `src/services/getProjects.ts`: obtiene los proyectos desplegados del usuario (GET `/deploy`).
  - `src/services/deleteProject.ts`: elimina un despliegue (DELETE `/deploy/:projectName`).

- **Estilos y diseño**
  - `App.css` e `index.css` combinados con clases utilitarias de Tailwind CSS.
  - Diseño **responsive**, con layouts específicos para desktop en `src/layouts/desktop/`.
  - Uso de animaciones ligeras (por ejemplo, gradientes animados, efectos de hover) para mejorar la UX sin comprometer el rendimiento.

En conjunto, el frontend proporciona una experiencia fluida donde el usuario:
1. Se autentica.
2. Visualiza sus despliegues.
3. Crea nuevos proyectos mediante formularios guiados.
4. Controla recursos (elimina proyectos, reabre accesos) sin necesidad de tocar directamente Docker o el servidor.

#### 1.3 Backend (Express + TypeScript)

El backend sigue una arquitectura modular organizada por dominio (`auth`, `deploy`, `monitor`, `services`, etc.) y expone una API REST para el frontend y Nginx.

- **Punto de entrada**
  - `src/index.ts`:
    - Crea la instancia de Express.
    - Configura CORS, parsing de JSON, manejo de cookies.
    - Registra las rutas principales (`routes/index.routes.ts`).
    - Activa el `errorMiddleware` para gestión centralizada de errores.
    - Inicia el `IdleContainerWorker` para el apagado automático de contenedores inactivos.

- **Módulo de autenticación (`src/auth/`)**
  - `auth.routes.ts`: define endpoints de autenticación (login, registro, obtención de usuario actual).
  - `auth.middleware.ts`:
    - Extrae el token de acceso de las cookies (`accessToken`).
    - Valida la sesión contra el servicio externo (Roble) o mediante `TokenService`.
    - Si es válido, añade `req.user` con los datos del usuario para uso posterior en el pipeline.
  - `auth.controller.ts`:
    - Orquesta la lógica de login/registro, gestionando errores y respuestas HTTP.
  - `services/auth.service.ts` / `services/token.service.ts` / `services/auth.manager.service.ts`:
    - Encapsulan la lógica de comunicación con Roble y/o validación de tokens.
    - Se encargan de renovar, invalidar o verificar tokens según la estrategia definida.

- **Módulo de despliegue (`src/deploy/`)**
  - `deploy.routes.ts`: define rutas como:
    - `POST /deploy` – creación de un nuevo despliegue.
    - `DELETE /deploy/:projectName` – eliminación de un despliegue.
    - `GET /deploy` – listado de despliegues del usuario autenticado.
    - `POST /deploy/notify-access/:project` – endpoint interno para actualizar `lastAccess`.
  - `deploy.controller.ts`:
    - `deploy`: recibe los datos del proyecto (`CreateDeployDto`) y el usuario autenticado, y delega la lógica al `DeployManagerService`.
    - `deleteDeploy`: valida parámetros, invoca `deployManager.deleteDeploy`.
    - `notifyAccess`: actualiza la métrica de último acceso sin requerir autenticación de usuario (ya que es interno desde Nginx).
    - `getDeploymentsByUserId`: consulta despliegues del usuario en la base de datos.
  - `deploy.manager.service.ts`:
    - Coordina todo el flujo de despliegue:
      1. Verificación de permisos y límites.
      2. Clonado del repositorio usando `GitService`.
      3. Construcción de la imagen Docker con `DockerService.buildImage`.
      4. Ejecución del contenedor con límites de recursos (`DockerService.runContainer`).
      5. Creación de la configuración de subdominio en Nginx vía `ReverseProxyService`.
      6. Registro del despliegue en SQLite mediante el repositorio y Prisma.
    - Implementa lógica de rollback en caso de errores (`DeployRollbackService`), asegurando que no queden contenedores o imágenes huérfanas.

- **Módulo de monitorización (`src/monitor/`)**
  - `idle-container.worker.ts`:
    - Clase `IdleContainerWorker` como singleton.
    - Lee parámetros de configuración desde `appConfig`:
      - `workerCheckIntervalS`: cada cuánto tiempo (en segundos) revisar los despliegues activos.
      - `workerInactivityThresholdS`: cuánto tiempo de inactividad se permite antes de apagar un contenedor.
    - Flujo:
      1. Consulta a `SqliteDBService` para obtener deployments activos.
      2. Calcula la diferencia entre el tiempo actual y `lastAccess`.
      3. Si `diff >= idleThresholdMs`, llama a `deployManager.sleep(containerName)` (o método equivalente) para detener el contenedor.
      4. Loggea eventos de apagado para auditoría básica.

- **Servicios auxiliares (`src/services/`)**
  - `docker.service.ts`:
    - `buildImage(repoPath, imageName)`: construye la imagen Docker del proyecto.
    - `runContainer(imageName, containerName, port)`: ejecuta el contenedor con:
      - `--cpus="0.5"`: límite de CPU.
      - `--memory="250m"`: límite de memoria.
      - `--network hosti_net` y `-p <port>`: configuración de red.
    - `stopContainer`, `startContainer`, `removeContainer`, `removeImage`.
    - `checkIfExists`, `checkIfRunning`: consultas al estado del contenedor.
  - `git.service.ts`:
    - Clona repositorios de GitHub en una ruta temporal (`appConfig.tmpRepoPath`).
    - Puede gestionar ramas, rutas específicas o subdirectorios según el template.
  - `reverseProxy.service.ts`:
    - Genera archivos de configuración de Nginx por proyecto:
      - `server_name {containerName}.localhost;`
      - `proxy_pass http://{containerName}:{port};`
      - Bloque `location /notify-access` que redirige a `backend:3000/deploy/notify-access/{containerName}`.
    - Guarda la configuración en la ruta `appConfig.nginxConfPath`.
    - Ejecuta `nginx -s reload` dentro del contenedor `nginx` para aplicar cambios.

- **Base de datos y repositorios (`src/db/`)**
  - `prisma/schema.prisma`: define el modelo `Deploy` con campos:
    - `id`, `userId`, `subdomain`, `repoUrl`, `description?`, `active`, `lastAccess`, `createdAt`.
  - `sqlite.db.service.ts`:
    - Encapsula la interacción con la base de datos SQLite.
    - Métodos como `getActiveDeployments`, `findDeploymentByUserId`, `updateLastAccess`, etc.
  - `deploy.repository.ts`:
    - Implementa consultas específicas relacionadas con despliegues (lectura/escritura, búsqueda por subdominio, usuario, etc.).

- **Configuración general (`src/shared/config/config.ts`)**
  - Define:
    - `port`: puerto del backend.
    - `robleUrl` y `tokenContract`: integración con Roble.
    - `backendUrl`: host y puerto “vista desde Nginx” (en producción suele ser `backend:3000`).
    - `tmpRepoPath`: ruta donde se clonan temporalmente los repositorios.
    - `nginxConfPath`: carpeta donde se escriben los `.conf` de Nginx.
    - `nginxPort`: puerto en el que Nginx expone los sitios.
    - `workerCheckIntervalS` y `workerInactivityThresholdS`: parámetros del worker de apagado automático.

#### 1.4 Nginx y contenedores de proyectos

- El contenedor `nginx` carga una configuración base (`nginx.conf`) y una carpeta `conf.d` compartida con el backend.
- Por cada proyecto desplegado, el backend genera un archivo de configuración:
  - Define un `server` que atiende en `:80`.
  - Asocia el subdominio `{proyecto}.{usuario}.localhost` al contenedor Docker correspondiente.
  - Interpone una ruta interna `/notify-access` que llama al backend para actualizar `lastAccess`.
- Los contenedores de proyectos corren en una red Docker común (`hosti_net`), de modo que Nginx puede resolverlos por nombre de contenedor.

---

### 2. Flujo de trabajo del sistema

#### 2.1 Flujo de autenticación (registro e inicio de sesión)

1. **Acceso a la aplicación**:
   - El usuario entra a la URL principal (por ejemplo `http://localhost/`).
   - El frontend renderiza la `LandingPage`.
2. **Navegación a Login**:
   - Al pulsar “Get Started” o un botón equivalente, el usuario es redirigido a `/login`.
3. **Registro / Inicio de sesión**:
   - El usuario completa el formulario de credenciales.
   - El frontend envía una petición al backend (`/auth/login` o `/auth/register`).
   - El backend valida las credenciales con Roble y, si son correctas:
     - Genera un token (o recibe uno de Roble).
     - Lo serializa en una **cookie HTTP-only** (`accessToken`) para protegerlo de acceso desde JavaScript.
   - Se devuelve información básica del usuario para mostrar en la UI.
4. **Establecimiento de sesión en el frontend**:
   - `AuthContext` guarda la información básica del usuario.
   - `isAuthenticated` se marca como `true`.
   - El usuario es redirigido al `Dashboard`.
5. **Protección de rutas**:
   - Las rutas como `/dashboard` y `/new-project` se envuelven con `ProtectedRoute`.
   - Si el usuario no está autenticado (no hay cookie válida o no se puede verificar en el backend), se redirige a `/login`.

#### 2.2 Flujo de creación y despliegue de un proyecto

1. **Acceso al formulario**:
   - En el `Dashboard`, el usuario hace clic en “Nuevo Proyecto”.
   - El frontend navega a `/new-project` y renderiza el formulario correspondiente.
2. **Completar formulario**:
   - El usuario indica:
     - Nombre del proyecto (por ejemplo, `miapp`).
     - URL del repositorio (por ejemplo, `https://github.com/usuario/miapp-template`).
     - Opcionalmente una descripción y/o un template.
3. **Envío al backend**:
   - El frontend envía una petición `POST /deploy` con el cuerpo que cumple `CreateDeployDto`.
   - La cookie `accessToken` se envía automáticamente (si se configuró `withCredentials` en Axios).
4. **Validación y preparación (backend)**:
   - El `auth.middleware` verifica el token y agrega `req.user`.
   - `DeployController.deploy` construye el DTO, valida datos y llama a `deployManager.handleDeploy`.
   - Se calcula un `containerName`/`subdomain` único, normalmente combinando nombre de proyecto + usuario (por ejemplo `miapp.estudiante`).
5. **Clonado del repositorio**:
   - `GitService` clona el repositorio en `tmp/repositories/...` (o en `/app/tmp/repositories` en producción).
   - Se verifican archivos necesarios (por ejemplo, presencia de `Dockerfile` o estructura exigida por el template).
6. **Construcción de la imagen Docker**:
   - `DockerService.buildImage` ejecuta `docker build` con el contexto del repo clonado.
   - La imagen se etiqueta con un nombre único relacionado al subdominio.
7. **Ejecución del contenedor**:
   - `DockerService.runContainer`:
     - Asigna límites de CPU y memoria.
     - Asigna un puerto interno para el proyecto.
     - Conecta el contenedor a la red `hosti_net`.
8. **Configuración del reverse proxy**:
   - `ReverseProxyService.createSubdomainConfig` genera un archivo `.conf` con:
     - `server_name miapp.estudiante.localhost;`
     - `proxy_pass http://miapp.estudiante:<puerto>;`
     - bloque `/notify-access` para llamar al backend.
   - Se guarda en `nginx/conf.d/`.
   - Se ejecuta `nginx -s reload` en el contenedor `nginx`.
9. **Registro en base de datos**:
   - Se crea una entrada `Deploy` con:
     - `userId`, `subdomain`, `repoUrl`, `description`, `active = true`, `lastAccess = now()`.
10. **Respuesta al frontend**:
    - El backend devuelve un JSON con información del despliegue y, opcionalmente, la URL de acceso.
    - El frontend muestra un mensaje de éxito y actualiza la lista de proyectos en el Dashboard.

#### 2.3 Flujo de acceso a un proyecto desplegado

1. **El usuario visita `http://miapp.estudiante.localhost/`**:
   - La petición llega a Nginx, que resuelve el `server_name`.
2. **Notificación de acceso**:
   - Antes de proxy-pasar la petición al contenedor del proyecto, Nginx realiza una subpetición interna a `/notify-access`.
   - Esta subpetición se traduce en una llamada al backend: `POST /deploy/notify-access/miapp.estudiante`.
3. **Actualización de `lastAccess`**:
   - El backend localiza el `Deploy` correspondiente y actualiza el campo `lastAccess` con la hora actual.
4. **Redirección al contenedor**:
   - Tras la notificación interna, Nginx redirige el tráfico al contenedor Docker (`proxy_pass http://miapp.estudiante:<puerto>`).
   - El usuario ve la aplicación web desplegada.

#### 2.4 Flujo de apagado automático y reactivación

1. **Worker de inactividad**:
   - `IdleContainerWorker` se ejecuta cada `workerCheckIntervalS` segundos.
   - Obtiene la lista de `Deploy` activos desde SQLite.
2. **Detección de inactividad**:
   - Para cada despliegue, calcula la diferencia entre `now` y `lastAccess`.
   - Si `diff >= workerInactivityThresholdS`:
     - Llama a `deployManager.sleep(containerName)` (o método equivalente).
     - Este detiene el contenedor vía `DockerService.stopContainer`.
     - Marca el despliegue como inactivo o guarda el estado necesario.
3. **Reactivación**:
   - Cuando un usuario vuelve a acceder a `miapp.estudiante.localhost`, pueden darse dos estrategias posibles:
     - a) Nginx sigue apuntando al mismo contenedor y el backend lo vuelve a arrancar cuando recibe la primera notificación de acceso.
     - b) El backend expone un endpoint específico para “despertar” el proyecto, invocado desde el frontend (p. ej. un botón “Reabrir” en el Dashboard).
   - En ambos casos, la lógica de reactivación se apoya en `DockerService.startContainer` o en recrear el contenedor a partir de la imagen.

---

### 3. Estrategia de seguridad y optimización de recursos

#### 3.1 Seguridad

**Autenticación y autorización**
- La comunicación de usuario–backend se realiza siempre con un token:
  - El token se almacena en una **cookie HTTP-only** (`accessToken`) para mitigar ataques XSS, ya que JavaScript no puede leer este valor.
  - Las rutas protegidas del backend utilizan `auth.middleware` para verificar:
    - La presencia de la cookie.
    - La validez del token mediante Roble o `TokenService`.
  - Solo si el token es válido se llena `req.user` y se permite el acceso a acciones sensibles (crear despliegues, listar proyectos, eliminar).

**Aislamiento por usuario**
- Cada contenedor se crea con un nombre único basado en:
  - Nombre del proyecto.
  - Identificador o nombre del usuario.
- Los subdominios generados son únicos (por ejemplo, `miapp.estudiante.localhost`), lo que evita colisiones.
- Aunque los contenedores comparten la misma red `hosti_net`, su superficie de exposición se limita al reverse proxy y a los puertos asignados.

**Manejo de errores y validación**
- Se utiliza Zod y DTOs (`CreateDeployDto`, `UpdateDeployDto`) para validar el cuerpo de las peticiones antes de ejecutar lógica de negocio.
- Se implementa `errorMiddleware` para:
  - Retornar respuestas JSON consistentes en caso de error.
  - Evitar fugas de información interna en errores no controlados.

**Política CORS**
- En `config.ts` se definen:
  - `CORS_ALLOWED_ORIGINS`: lista de orígenes permitidos (por ejemplo, `http://localhost:5173`, `http://localhost`).
  - `CORS_ALLOWED_DOMAINS`: dominios permitidos para permitir variantes de subdominios.
- El backend valida el origen de cada petición:
  - Si no está en `allowedOrigins` ni termina en un `allowedDomain`, la petición es rechazada.

**Seguridad en el reverse proxy**
- Nginx se encarga de:
  - Aceptar únicamente tráfico HTTP hacia los subdominios configurados.
  - Proteger la ruta `/notify-access` marcándola como `internal`, de forma que solo Nginx puede invocarla.
  - Esto evita que un cliente externo manipule el registro de actividad (`lastAccess`) de manera directa.

**Buenas prácticas adicionales**
- Uso de `cookie-parser` y `cors` configurados con `credentials: true`.
- Separación clara entre responsabilidades de frontend, backend y Nginx.
- No se exponen credenciales de servicios externos en el frontend; todo pasa por el backend.

#### 3.2 Optimización de recursos

**Límites de CPU y memoria por contenedor**
- En `docker.service.ts`, al ejecutar un contenedor se indican:
  - `--cpus="0.5"`: el contenedor solo puede usar medio core de CPU.
  - `--memory="250m"`: el contenedor no puede exceder 250 MB de RAM.
- Esto previene que un único proyecto consuma todos los recursos del servidor.
- Los valores son ajustables si la carga de trabajo o el tipo de plantilla lo requieren.

**Parámetros configurables del worker**
- `workerCheckIntervalS` y `workerInactivityThresholdS` permiten:
  - Reducir el tiempo que un contenedor inactivo permanece consumiendo recursos.
  - Ajustar la agresividad del apagado según las necesidades del entorno (por ejemplo, mayor en un entorno académico compartido).

**Apagado automático de contenedores inactivos**
- El flujo de apagado automático:
  - Reduce dramáticamente la cantidad de contenedores activos al mismo tiempo.
  - Libera CPU y memoria para nuevos despliegues.
  - Evita que proyectos olvidados permanezcan corriendo indefinidamente.

**Uso de SQLite y Prisma**
- SQLite:
  - Es liviano y suficiente para escenarios académicos o monolíticos.
  - Minimiza la sobrecarga operativa (no se necesita un servidor de base de datos dedicado).
- Prisma:
  - Proporciona un acceso tipado a la base de datos.
  - Facilita la escritura de queries optimizadas y consistentes.

**Reutilización de imágenes Docker**
- Cuando es posible, el sistema puede:
  - Reutilizar imágenes previamente construidas para el mismo proyecto/usuario.
  - Evitar builds innecesarios cuando no se han producido cambios relevantes en el repositorio.
- Esto reduce:
  - Tiempo de despliegue.
  - Carga sobre la CPU y el disco del servidor.

**Frontend optimizado**
- Uso de Vite:
  - Dev server rápido y eficiente en desarrollo.
  - Generación de bundles optimizados para producción (code splitting, minificación, etc.).
- React + Tailwind:
  - Minimiza CSS innecesario usando clases utilitarias.
  - Componentes reutilizables reducen duplicación y tamaño global del bundle.

---

### 4. Conclusión

Este documento técnico detalla la arquitectura de Hosti, el funcionamiento de sus componentes frontend y backend, y los flujos clave del sistema: autenticación, despliegue, acceso y apagado automático de proyectos. Además, describe la estrategia de seguridad basada en autenticación robusta, CORS controlado, cookies HTTP-only y aislamiento lógico de usuarios, junto con un enfoque de optimización de recursos que limita CPU/memoria por contenedor y apaga automáticamente instancias inactivas.

En conjunto, la plataforma proporciona un entorno controlado, eficiente y pedagógico para que los estudiantes puedan desplegar aplicaciones web dockerizadas sin necesidad de gestionar directamente la infraestructura subyacente.


