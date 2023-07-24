<?php
require 'Conexion.php';

class Cliente extends Conexion{
    public $cliente_id;
    public $cliente_nombre;
    public $cliente_nit;
    public $cliente_situacion;

    public function __construct($args = [] )
    {
        $this->cliente_id = $args['cliente_id'] ?? null;
        $this->cliente_nombre = $args['cliente_nombre'] ?? '';
        $this->cliente_nit = $args['cliente_nit'] ?? '';
        $this->cliente_situacion = $args['cliente_situacion'] ?? 1;
    }

    public function guardar(){
        // Validar el NIT antes de guardar los datos
        if (!$this->validarNit($this->cliente_nit)) {

      return 0;

        }
    
        $sql = "INSERT INTO clientes (cliente_nombre, cliente_nit) VALUES ('$this->cliente_nombre','$this->cliente_nit')";
        $resultado = self::ejecutar($sql);
     
        if ($resultado) {

            return $resultado;
        } else {

          
            return 0;
        }
           
    }
    
    public function buscar(){
        $sql = "SELECT * from clientes where cliente_situacion = 1 ";

        if($this->cliente_nombre != ''){
            $sql .= " and cliente_nombre like '%$this->cliente_nombre%' ";
        }

        if($this->cliente_nit != ''){
            $sql .= " and cliente_nit = $this->cliente_nit ";
        }

        if($this->cliente_id != null){
            $sql .= " and cliente_id = $this->cliente_id ";
        }

        $resultado = self::servir($sql);
        return $resultado;
    }

    public function modificar(){

        if (!$this->validarNit($this->cliente_nit)) {

            return 0;
      
              }

        $sql = "UPDATE clientes  SET cliente_nombre = '$this->cliente_nombre', cliente_nit = $this->cliente_nit where cliente_id = $this->cliente_id";
        
        $resultado = self::ejecutar($sql);
        if ($resultado) {

            return $resultado;
        } else {

          
            return 0;
        }
    }

    public function eliminar(){
        $sql = "UPDATE clientes  SET cliente_situacion = 0 where cliente_id = $this->cliente_id";
        
        $resultado = self::ejecutar($sql);
        return $resultado;
    }

    public function validarNit($cliente_nit){
        //con esta funcion se elimina culaquier espacio o guion del nit ingresado
        $cliente_nit = str_replace(['-', ' '], '', $cliente_nit);
    
        // al momento de ingresar el nit por medio de esta duncion se verifica si es de 8 digitos
        if (strlen($cliente_nit) !== 8) {
            return false;
        }
    
        // aqui se realiza la validacion del nit
        $suma = 0;
        for ($i = 0; $i < 7; $i++) {
            $suma += intval($cliente_nit[$i]) * (8 - $i);
        }
        $residuo = $suma % 11;
        $respuesta = 11 - $residuo;
    
        $digitoVerificador = intval($cliente_nit[7]);
    
        // se comprueba si el nit ingresado es igual al dígito verificador
        if ($respuesta == $digitoVerificador || ($respuesta == 10 && $digitoVerificador == 0)) {
            return true;
        } else {
            return false;
        }
    }
    
}