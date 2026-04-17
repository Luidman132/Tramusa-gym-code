-- ============================================================
-- Base de Datos: tramusagym_db
-- Proyecto: Tramusa S.A. - Sistema de Gestión de Gimnasio
-- Versión: 2.0 — Columnas sincronizadas con Backend PHP y Frontend React
-- ============================================================

CREATE DATABASE IF NOT EXISTS tramusagym_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tramusagym_db;

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('Admin', 'Recepcion') NOT NULL DEFAULT 'Recepcion',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: configuracion
-- [AGREGADO] logo_base64       → guardar_configuracion.php / obtener_configuracion.php
-- [AGREGADO] plantilla_whatsapp → guardar_configuracion.php / ConfiguracionView.jsx
-- ============================================================
CREATE TABLE IF NOT EXISTS configuracion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_gimnasio VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  moneda VARCHAR(10) DEFAULT 'S/',
  mensaje_ticket VARCHAR(255) DEFAULT NULL,
  direccion VARCHAR(255) DEFAULT NULL,
  logo_base64 MEDIUMTEXT DEFAULT NULL,
  plantilla_whatsapp TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- ============================================================
-- TABLA: planes
-- ============================================================
CREATE TABLE IF NOT EXISTS planes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  duracion_dias INT NOT NULL,
  es_promocion BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_inicio_venta DATE DEFAULT NULL,
  fecha_fin_venta DATE DEFAULT NULL,
  nota TEXT DEFAULT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: miembros
-- [AGREGADO] email                         → guardar_miembro.php / editar_miembro.php
-- [AGREGADO] contacto_emergencia_nombre    → guardar_miembro.php / editar_miembro.php
-- [AGREGADO] contacto_emergencia_telefono  → guardar_miembro.php / editar_miembro.php
-- [AGREGADO] eliminado                     → obtener_miembros.php / eliminar_miembro.php / obtener_actividad_reciente.php
-- [CAMBIADO] plan_id ahora permite NULL    → para inscripciones con plan personalizado (sin plan predefinido)
-- ============================================================
CREATE TABLE IF NOT EXISTS miembros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL DEFAULT '',
  telefono VARCHAR(20) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  contacto_emergencia_nombre VARCHAR(100) DEFAULT NULL,
  contacto_emergencia_telefono VARCHAR(20) DEFAULT NULL,
  plan_id INT DEFAULT NULL,
  fecha_inicio DATE DEFAULT NULL,
  fecha_fin DATE DEFAULT NULL,
  qr_token VARCHAR(100) NOT NULL UNIQUE,
  notas TEXT DEFAULT NULL,
  estado ENUM('Activo', 'Vencido', 'Congelado') NOT NULL DEFAULT 'Activo',
  eliminado TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_miembros_plan FOREIGN KEY (plan_id) REFERENCES planes(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: visitas_libres
-- ============================================================
CREATE TABLE IF NOT EXISTS visitas_libres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(20) NOT NULL,
  nombre_completo VARCHAR(200) NOT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  monto_pagado DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('Efectivo', 'Yape', 'Tarjeta') NOT NULL DEFAULT 'Efectivo',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT NOT NULL,
  CONSTRAINT fk_visitas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: transacciones
-- [AGREGADO] tipo_transaccion → para diferenciar Ingresos de Egresos (gastos del gimnasio)
-- ============================================================
CREATE TABLE IF NOT EXISTS transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  concepto VARCHAR(100) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  tipo_transaccion ENUM('Ingreso', 'Egreso') NOT NULL DEFAULT 'Ingreso',
  metodo_pago ENUM('Efectivo', 'Yape', 'Tarjeta') NOT NULL DEFAULT 'Efectivo',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  miembro_id INT DEFAULT NULL,
  usuario_id INT NOT NULL,
  CONSTRAINT fk_transacciones_miembro FOREIGN KEY (miembro_id) REFERENCES miembros(id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_transacciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: asistencias
-- ============================================================
CREATE TABLE IF NOT EXISTS asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  miembro_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_asistencias_miembro FOREIGN KEY (miembro_id) REFERENCES miembros(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- DATOS INICIALES (SEED)
-- ============================================================

-- Usuarios
INSERT INTO usuarios (nombre, correo, password, rol, activo) VALUES
  ('Julio Admin', 'julio@tramusa.pe', 'admin123', 'Admin', TRUE),
  ('Dina Recepcion', 'dina@tramusa.pe', 'recepcion123', 'Recepcion', TRUE);

-- Configuración del negocio (1 fila)
INSERT INTO configuracion (id, nombre_gimnasio, telefono, moneda, mensaje_ticket, direccion) VALUES
  (1, 'Tramusa S.A.', '+51 999 888 777', 'S/', '¡Gracias por entrenar con nosotros! Pase oficial de acceso.', 'Av. Principal 123, Ciudad');

-- ============================================================
-- SCRIPT DE MIGRACIÓN (para BD existentes que ya tienen datos)
-- Ejecutar SOLO si ya tienes la base creada con datos y necesitas agregar las columnas nuevas.
-- Si estás creando la BD desde cero, ignora este bloque.
-- ============================================================
-- ALTER TABLE miembros ADD COLUMN IF NOT EXISTS email VARCHAR(150) DEFAULT NULL AFTER telefono;
-- ALTER TABLE miembros ADD COLUMN IF NOT EXISTS contacto_emergencia_nombre VARCHAR(100) DEFAULT NULL AFTER email;
-- ALTER TABLE miembros ADD COLUMN IF NOT EXISTS contacto_emergencia_telefono VARCHAR(20) DEFAULT NULL AFTER contacto_emergencia_nombre;
-- ALTER TABLE miembros ADD COLUMN IF NOT EXISTS eliminado TINYINT(1) NOT NULL DEFAULT 0 AFTER estado;
-- ALTER TABLE miembros MODIFY COLUMN plan_id INT DEFAULT NULL;
-- ALTER TABLE miembros MODIFY COLUMN fecha_inicio DATE DEFAULT NULL;
-- ALTER TABLE miembros MODIFY COLUMN fecha_fin DATE DEFAULT NULL;
-- ALTER TABLE miembros MODIFY COLUMN apellidos VARCHAR(100) NOT NULL DEFAULT '';
-- ALTER TABLE configuracion ADD COLUMN IF NOT EXISTS logo_base64 MEDIUMTEXT DEFAULT NULL AFTER direccion;
-- ALTER TABLE configuracion ADD COLUMN IF NOT EXISTS plantilla_whatsapp TEXT DEFAULT NULL AFTER logo_base64;
-- ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS tipo_transaccion ENUM('Ingreso', 'Egreso') NOT NULL DEFAULT 'Ingreso' AFTER monto;
