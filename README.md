# Ecommerce Project

## Descripción
Este proyecto es una aplicación de ecommerce que incluye un sistema de gestión de usuarios con autenticación y autorización. Permite a los usuarios registrarse, iniciar sesión y realizar operaciones CRUD sobre su información.

## Estructura del Proyecto
El proyecto está organizado en las siguientes carpetas y archivos:

- **src/**: Contiene el código fuente de la aplicación.
  - **controllers/**: Controladores que manejan la lógica de negocio.
    - `authController.js`: Controlador para la autenticación de usuarios.
    - `userController.js`: Controlador para las operaciones CRUD de usuarios.
  - **middlewares/**: Middleware para la gestión de autenticación y errores.
    - `authMiddleware.js`: Middleware que verifica la autenticación del usuario.
    - `errorHandler.js`: Middleware para manejar errores de la aplicación.
  - **models/**: Modelos de datos de la aplicación.
    - `User.js`: Modelo de usuario que define la estructura y encriptación de la contraseña.
  - **routes/**: Definición de las rutas de la aplicación.
    - `authRoutes.js`: Rutas relacionadas con la autenticación.
    - `userRoutes.js`: Rutas para las operaciones CRUD de usuarios.
  - **services/**: Lógica de negocio relacionada con la autenticación.
    - `authService.js`: Servicio para la gestión de autenticación y generación de tokens.
  - **utils/**: Utilidades y funciones auxiliares.
    - `jwtHelper.js`: Funciones para generar y verificar tokens JWT.
  - `app.js`: Punto de entrada de la aplicación.

- **config/**: Configuraciones de la aplicación.
  - `passport.js`: Configuración de las estrategias de Passport para autenticación.

- **package.json**: Configuración del proyecto y dependencias.

- **.env**: Variables de entorno para la configuración de la aplicación.

- **.gitignore**: Archivos y carpetas que deben ser ignorados por Git.

## Instalación
1. Clona el repositorio en tu máquina local.
2. Navega a la carpeta del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.
4. Crea un archivo `.env` y configura las variables necesarias.
5. Ejecuta `node src/app.js` para iniciar la aplicación.

## Uso
- Regístrate como un nuevo usuario mediante la ruta `/api/auth/register`.
- Inicia sesión en tu cuenta mediante la ruta `/api/auth/login`.
- Accede a las rutas protegidas utilizando el token JWT obtenido al iniciar sesión.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

