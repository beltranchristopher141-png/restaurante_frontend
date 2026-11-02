# Sabor Restaurante — Frontend

Panel de administración para restaurante desarrollado con React + Vite. No utiliza backend, API ni MySQL.

## Funciones
- Resumen de ventas registradas y pedidos.
- Crear, editar, eliminar y cambiar el estado de pedidos.
- Administrar menú, precios, categorías y disponibilidad.
- Control de inventario y existencias.
- Registrar y administrar empleados y turnos.
- Configuración general.
- Guardado automático con `localStorage`.

## Ejecutar localmente
```bash
npm install
npm run dev
```

## Compilar
```bash
npm run build
```

## Publicar en Vercel
1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel, selecciona **Add New → Project** e importa el repositorio.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Pulsa **Deploy**.

## Importante sobre los datos
Los datos se guardan únicamente en el navegador mediante `localStorage`. No se comparten entre dispositivos o usuarios. Si se borran los datos del navegador, se perderán. Para sincronizar pedidos entre varios dispositivos se necesita un servicio de almacenamiento en la nube.
