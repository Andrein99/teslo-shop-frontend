# Teslo Shop - Frontend

Frontend de una aplicación de tienda en línea desarrollada con Angular que consume una API REST construida con NestJS.

## 🚀 Demo en Vivo

- **Frontend**: [https://teslo-shop-front-acg.netlify.app](https://teslo-shop-front-acg.netlify.app/#/)
- **Plataforma de despliegue**: Netlify

## 📋 Descripción

Aplicación de comercio electrónico completa que permite la gestión de productos, autenticación de usuarios. El frontend está desarrollado con Angular y se comunica con un backend basado en NestJS.

## ✨ Características Principales

- 🛍️ Catálogo de productos con búsqueda y filtros
- 👤 Sistema de autenticación y autorización de usuarios
- 📄 Paginación de productos
- 📱 Diseño responsive
- 🔐 Rutas protegidas según roles de usuario

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Angular 20.3.4
- **Lenguaje**: TypeScript
- **Herramientas**: Angular CLI

### Backend
- **Framework**: NestJS
- **Plataforma**: Render
- **Base de datos**: PostgreSQL (Neon)

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior recomendada)
- npm o yarn
- Angular CLI

### Pasos de Instalación
**(Es importante que si quieres correr el proyecto de manera local debes utilizar Docker para levantar el backend [Repositorio de Teslo Shop backend](https://github.com/Andrein99/teslo-shop-backend-nest))**

1. Clonar el repositorio:
```bash
git clone https://github.com/Andrein99/teslo-shop-frontend.git
cd teslo-shop-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo de configuración con la URL del backend API (ajustar según tu entorno de desarrollo)
```bash
ng g environment
```
En tu entorno puedes crear 
```typescript
export const environment = {
  baseUrl: 'http://localhost:3000/api',
};
```

5. Iniciar el servidor de desarrollo:
```bash
ng serve
```

5. Abrir el navegador en `http://localhost:4200/` o en la ruta local que sirva el contenido.

## 🏗️ Comandos Disponibles

### Desarrollo
```bash
ng serve                    # Inicia el servidor de desarrollo
ng generate component name  # Genera un nuevo componente
ng generate --help          # Lista todos los esquemas disponibles
```

### Producción
```bash
ng build                    # Compila el proyecto para producción
```

Los archivos compilados se almacenarán en el directorio `dist/`.



## 🌐 Arquitectura de Despliegue

```
┌─────────────────────┐
│   Netlify           │
│   (Frontend)        │
│   Angular App       │
└──────────┬──────────┘
           │
           │ API Calls
           │
┌──────────▼──────────┐
│   Render            │
│   (Backend)         │
│   NestJS API        │
└──────────┬──────────┘
           │
           │ Database
           │
┌──────────▼──────────┐
│   Neon              │
│   (PostgreSQL)      │
└─────────────────────┘
```

## 📚 Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Repositorio Backend](https://github.com/Andrein99/teslo-shop-backend-nest)

## 👨‍💻 Autor

**Andrein99**

- GitHub: [@Andrein99](https://github.com/Andrein99)

## 📄 Licencia

Este proyecto está bajo una licencia de código abierto. Consulta el archivo LICENSE para más detalles.

---

**Nota**: Para configurar y ejecutar el backend, consulta el repositorio correspondiente que incluye la configuración de NestJS y PostgreSQL.
