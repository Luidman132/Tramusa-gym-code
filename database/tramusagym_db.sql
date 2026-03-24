-- ============================================================
-- Base de Datos: tramusagym_db
-- Proyecto: Tramusa S.A. - Sistema de Gestión de Gimnasio
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
-- TABLA: configuracion_empresa
-- ============================================================
CREATE TABLE IF NOT EXISTS configuracion_empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_gimnasio VARCHAR(150) NOT NULL,
  moneda VARCHAR(10) NOT NULL DEFAULT 'PEN',
  direccion VARCHAR(255) DEFAULT NULL,
  telefono VARCHAR(30) DEFAULT NULL,
  mensaje_ticket TEXT DEFAULT NULL,
  plantilla_bienvenida TEXT DEFAULT NULL,
  plantilla_vencimiento TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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
-- ============================================================
CREATE TABLE IF NOT EXISTS miembros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  plan_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  qr_token VARCHAR(100) NOT NULL UNIQUE,
  notas TEXT DEFAULT NULL,
  estado ENUM('Activo', 'Vencido', 'Congelado') NOT NULL DEFAULT 'Activo',
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
-- ============================================================
CREATE TABLE IF NOT EXISTS transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  concepto VARCHAR(100) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
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

-- Configuración de la empresa (1 fila)
INSERT INTO configuracion_empresa (nombre_gimnasio, moneda, direccion, telefono, mensaje_ticket, plantilla_bienvenida, plantilla_vencimiento) VALUES
  (
    'Tramusa S.A.',
    'PEN',
    'Av. Principal 123, Lima, Perú',
    '+51 999 999 999',
    '¡Gracias por tu visita a Tramusa S.A.! Te esperamos pronto.',
    'Hola {{nombre}}, ¡bienvenido/a a Tramusa S.A.! 🏋️ Tu membresía *{{plan}}* está activa hasta el {{fecha_fin}}. ¡Nos vemos en el gym!',
    'Hola {{nombre}}, tu membresía *{{plan}}* vence el {{fecha_fin}}. 📅 Renueva ahora y no pierdas tu racha. ¡Te esperamos!'
  );
