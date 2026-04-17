<?php
// 1. Permisos de seguridad (CORS) para que tu React no sea bloqueado
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Responder a las peticiones previas de React
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Credenciales por defecto de MAMP en Mac
$host = "localhost";
$dbname = "tramusagym_db"; // Tu base de datos
$username = "root";        // MAMP usa root
$password = "root";        // MAMP usa root

// 3. Intentar conectar a MySQL
try {
    $conexion = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // MENSAJE DE PRUEBA (Lo borraremos después)
#    echo "¡Conexion exitosa a la base de datos Tramusa S.A.!";

} catch (PDOException $e) {
    echo "Error terrible de conexión: " . $e->getMessage();
    die();
}
?>