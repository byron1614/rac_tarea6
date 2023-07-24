<?php
require '../../modelos/Cliente.php';

$metodo = $_SERVER['REQUEST_METHOD'];

$tipo = $_POST['tipo'];

try {
    switch ($metodo) {
        case 'POST':

            $cliente = new Cliente($_POST);

            if ($tipo == 1) {
                $resultado = $cliente->guardar();
                $mensaje = "Cliente guardado correctamente";
            } elseif ($tipo == 2) {
                $resultado = $cliente->modificar();
                $mensaje = "Cliente modificado correctamente";
            } elseif ($tipo == 3) {
                $resultado = $cliente->eliminar();
                $mensaje = "Cliente eliminado correctamente";
            } else {
                echo json_encode([
                    'mensaje' => 'Tipo de operación inválido',
                    'codigo' => 0
                ]);
                exit;
            }

            if ($resultado) {
                echo json_encode([
                    'mensaje' => $mensaje,
                    'codigo' => 1
                ]);
            } else {
                echo json_encode([
                    'mensaje' => 'Ocurrió un error al realizar la operación',
                    'codigo' => 0
                ]);
            }

            break;

        case 'GET':
            $cliente = new Cliente($_GET);
            $clientes = $cliente->buscar();

            echo json_encode($clientes);
            break;

        default:
            echo json_encode([
                'mensaje' => 'Método no permitido',
                'codigo' => 0
            ]);
            break;
    }

} catch (Exception $e) {
    echo json_encode([
        'detalle' => $e->getMessage(),
        'mensaje' => 'Ocurrió un error',
        'codigo' => 0
    ]);
}
