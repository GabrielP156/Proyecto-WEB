# Zona de Ataque

FrontEnd del proyecto final de desarrollo web (React + Vite + Tailwind CSS + shadcn/ui), que consume la API de `api-citas`.

## Requisitos previos

- Node.js 18+
- MySQL corriendo ( con XAMPP)

## 1. Levantar la API (`api-citas/api`)

```bash
cd ../api-citas/api
npm install
```


```bash
npm run init
```

Si ya migraste antes y solo quieres levantar el servidor:

```bash
npm run server
```

La API queda escuchando en `http://localhost:3000` (documentación Swagger en `http://localhost:3000/api-docs`).

## 2. Levantar el FrontEnd (esta carpeta)

```bash
npm install
```
```bash
npm run dev
```

Queda disponible en `http://localhost:5173`.

## 3. Cargar los datos de prueba (seeds)

**Importante:** la API debe estar corriendo antes de ejecutar estos scripts, y se corren desde esta carpeta (`Proyecto-WEB--`), no desde `api-citas`.

```bash
node scripts/seed-horarios.js
node scripts/seed-datos.js
```

- `seed-horarios.js` carga el horario semanal de atención (Lunes a Domingo).
- `seed-datos.js` carga servicios, adicionales, empleados, restricciones y citas de ejemplo (usa el usuario admin sembrado por `npm run init` y los usuarios con rol Empleado que ya deben existir en la base de datos).

Ambos scripts inician sesión como `admin@citas.com` y usan los endpoints de la API — no tocan la base de datos directamente. Están pensados para correr **una sola vez** sobre una base de datos recién migrada; si se vuelven a ejecutar sobre datos que ya existen, van a fallar en los registros duplicados (nombres de servicio repetidos, código de empleado repetido, etc.).

## Credenciales de incio segun script 

admin

- correo: `admin@citas.com`
- contraseña: `Admin12345`

empleados

- Carlos Rojas — correo: `carlos.empleado@citas.com` / contraseña: `Empleado123`
- Diana Vargas — correo: `diana.empleado@citas.com` / contraseña: `Empleado123`
- Luis Jiménez — correo: `luis.empleado@citas.com` / contraseña: `Empleado123`

Nota: estos usuarios Empleado no los crea `seed-datos.js` (no existe endpoint para crear usuarios con ese rol desde la API); hay que insertarlos manualmente en la base de datos antes de correr el script.

