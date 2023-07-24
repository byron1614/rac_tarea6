// Obtenemos las referencias a los elementos del formulario y la tabla
const formulario = document.querySelector('form');
const botonBuscar = document.getElementById('botonBuscar');
const botonModificar = document.getElementById('botonModificar');
const botonGuardar = document.getElementById('botonGuardar');
const botonCancelar = document.getElementById('botonCancelar');
const divTabla = document.getElementById('divTabla');
const tablaProductos = document.getElementById('tablaProductos');

// Inicialmente, deshabilitamos los botones de Modificar y Cancelar y los ocultamos
botonModificar.disabled = true;
botonModificar.parentElement.style.display = 'none';
botonCancelar.disabled = true;
botonCancelar.parentElement.style.display = 'none';

// Función para guardar datos en el formulario
const guardar = async (evento) => {
  evento.preventDefault();

  // Validamos que el formulario esté completo
  if (!validarFormulario(formulario, ['cliente_id'])) {
    Swal.fire('Campos incompletos', 'Debe llenar todos los campos', 'error');
    return;
  }

  // Creamos un objeto FormData con los datos del formulario y agregamos el tipo de operación
  const body = new FormData(formulario);
  body.append('tipo', 1);
  body.delete('cliente_id');
  const url = '/rac_tarea6_1/controladores/clientes/index.php';
  const config = {
    method: 'POST',
    body,
  };

  try {
    // Enviamos la solicitud al servidor
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();
    console.log(data);

    const { codigo, mensaje, detalle } = data;

    // Dependiendo de la respuesta del servidor, mostramos un mensaje de éxito o error
    switch (codigo) {
      case 1:
        formulario.reset();
        buscar();

        Swal.fire('Guardado exitosamente', mensaje, 'success');
        break;

      case 0:
        console.log(detalle);
        Swal.fire('Error en el ingreso de datos', mensaje, 'error');
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

// Función para buscar datos en la tabla
const buscar = async () => {
  let cliente_nombre = formulario.cliente_nombre.value;
  let cliente_nit = formulario.cliente_nit.value;
  const url = `/rac_tarea6/controladores/clientes/index.php?cliente_nombre=${cliente_nombre}&cliente_nit=${cliente_nit}`;
  const config = {
    method: 'GET'
  };

  try {
    // Enviamos la solicitud al servidor
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();

    // Limpiamos la tabla antes de actualizarla
    tablaProductos.tBodies[0].innerHTML = '';
    const fragment = document.createDocumentFragment();
    console.log(data);

    if (data.length > 0) {
      let contador = 1;
      data.forEach(cliente => {
        // Creamos los elementos de la fila en la tabla
        const tr = document.createElement('tr');
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        const td5 = document.createElement('td')
        const buttonModificar = document.createElement('button')
        const buttonEliminar = document.createElement('button')

        // Establecemos las características de los botones
        buttonModificar.classList.add('btn', 'btn-warning')
        buttonEliminar.classList.add('btn', 'btn-danger')
        buttonModificar.textContent = 'Modificar'
        buttonEliminar.textContent = 'Eliminar'

        // Agregamos los eventos para los botones Modificar y Eliminar
        buttonModificar.addEventListener('click', () => colocarDatos(cliente))
        buttonEliminar.addEventListener('click', () => eliminar(cliente.CLIENTE_ID))

        // Llenamos las celdas con los datos del cliente
        td1.innerText = contador;
        td2.innerText = cliente.CLIENTE_NOMBRE
        td3.innerText = cliente.CLIENTE_NIT

        // Agregamos los botones a las celdas correspondientes
        td4.appendChild(buttonModificar)
        td5.appendChild(buttonEliminar)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)

        // Agregamos la fila al fragmento del documento
        fragment.appendChild(tr);

        contador++;
      })
    } else {
      // Si no hay datos, mostramos un mensaje en la tabla
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.innerText = 'No existen registros';
      td.colSpan = 5;
      tr.appendChild(td);
      fragment.appendChild(tr);
    }

    // Actualizamos la tabla con los nuevos datos
    tablaProductos.tBodies[0].appendChild(fragment);
  } catch (error) {
    console.log(error);
  }
};

// Función para colocar datos en el formulario al seleccionar un cliente
const colocarDatos = (datos) => {
  console.log(datos)
  formulario.cliente_nombre.value = datos.CLIENTE_NOMBRE
  formulario.cliente_nit.value = datos.CLIENTE_NIT
  formulario.cliente_id.value = datos.CLIENTE_ID

  // Habilitamos y deshabilitamos los botones apropiados para modificar el cliente
  botonGuardar.disabled = true
  botonGuardar.parentElement.style.display = 'none'
  botonBuscar.disabled = true
  botonBuscar.parentElement.style.display = 'none'
  botonModificar.disabled = false
  botonModificar.parentElement.style.display = ''
  botonCancelar.disabled = false
  botonCancelar.parentElement.style.display = ''
  divTabla.style.display = 'none'
}

// Función para cancelar la acción de modificar o guardar
const cancelarAccion = () => {
  botonGuardar.disabled = false
  botonGuardar.parentElement.style.display = ''
  botonBuscar.disabled = false
  botonBuscar.parentElement.style.display = ''
  botonModificar.disabled = true
  botonModificar.parentElement.style.display = 'none'
  botonCancelar.disabled = true
  botonCancelar.parentElement.style.display = 'none'
  divTabla.style.display = ''
}

// Función para modificar un cliente
const modificar = async () => {
  const cliente_id = formulario.cliente_id.value;

  if (!cliente_id) {
    Swal.fire('Cliente no seleccionado', 'No se ha seleccionado ningún cliente para modificar.', 'error');
    return;
  }

  // Validamos que el formulario esté completo antes de modificar
  if (!validarFormulario(formulario, ['cliente_nombre'])) {
    Swal.fire('Campos incompletos', 'Debe llenar todos los campos.', 'error');
    return;
  }

  // Creamos un objeto FormData con los datos del formulario y agregamos el tipo de operación y el ID del cliente
  const body = new FormData(formulario);
  body.append('tipo', 2);
  body.append('cliente_id', cliente_id)

  const url = '/rac_tarea6/controladores/clientes/index.php';
  const config = {
    method: 'POST',

    body,
  };
  
  try {
    // Enviamos la solicitud al servidor
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();
    console.log(data);
  
    const { codigo, mensaje, detalle } = data;
  
    // Dependiendo de la respuesta del servidor, mostramos un mensaje de éxito o error
    switch (codigo) {
      case 1:
        formulario.reset();
        cancelarAccion();
        buscar();
  
        Swal.fire('informacion actulizada', mensaje, 'success');
        break;
  
      case 0:
        Swal.fire('Error, verifique que sus datos ingresados sean correctos', mensaje, 'error');
        break;
  
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
  };
  
  // Función para eliminar un cliente
  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: '¿Desea eliminar este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    });
  
    if (result.isConfirmed) {
      const url = `/rac_tarea6/controladores/clientes/index.php`;
      const body = new FormData();
      body.append('tipo', 3);
      body.append('cliente_id', id);
      const config = {
        method: 'POST',
        body,
      };
  
      try {
        // Enviamos la solicitud al servidor
        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje } = data;
  
        // Dependiendo de la respuesta del servidor, mostramos un mensaje de éxito o error
        switch (codigo) {
          case 1:
            buscar();
            Swal.fire('Eliminado exitosamente', mensaje, 'success');
            break;
  
          case 0:
            Swal.fire('Error verifique los datos', mensaje, 'error');
            break;
  
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  // Llamamos a la función buscar() para cargar los datos iniciales en la tabla
  buscar();
  
  // Asignamos eventos a los elementos del formulario y botones
  formulario.addEventListener('submit', guardar);
  botonBuscar.addEventListener('click', buscar);
  botonModificar.addEventListener('click', modificar);
  botonCancelar.addEventListener('click', cancelarAccion);
  