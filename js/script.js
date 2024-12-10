
// Para el formulario de contacto
document.getElementById('form-contacto').addEventListener('submit', async function (e) 
{
    e.preventDefault(); // Evita la redirección predeterminada

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const mensajeValidacion = document.getElementById('mensaje-validacion');
    const botonEnviar = e.target.querySelector('button[type="submit"]');

    // Resetear estado
    mensajeValidacion.className = "";
    mensajeValidacion.style.display = "none";
    mensajeValidacion.textContent = "";
    botonEnviar.disabled = true; // Desactivar el botón para evitar múltiples envíos

    // Validar campos
    if (!nombre || !email || !mensaje) 
    {
        mensajeValidacion.classList.add("error");
        mensajeValidacion.textContent = "Todos los campos son obligatorios.";
        mensajeValidacion.style.display = "block";
        botonEnviar.disabled = false; // Reactivar el botón
        return;
    }

    // Validar formato del correo
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) 
    {
        mensajeValidacion.classList.add("error");
        mensajeValidacion.textContent = "El formato del correo no es válido.";
        mensajeValidacion.style.display = "block";
        botonEnviar.disabled = false; // Reactivar el botón
        return;
    }

    // Enviar datos a Formspree
    try 
    {
        const response = await fetch('https://formspree.io/f/xqakwoek', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, mensaje }),
        });

        if (response.ok) 
        {
            // Mostrar mensaje de éxito
            mensajeValidacion.classList.add("success");
            mensajeValidacion.textContent = "¡Consulta enviada con éxito!";
            mensajeValidacion.style.display = "block";

            // Limpiar formulario
            document.getElementById('nombre').value = '';
            document.getElementById('email').value = '';
            document.getElementById('mensaje').value = '';

            // Ocultar mensaje después de 5 segundos
            setTimeout(function() 
            {
                mensajeValidacion.style.display = "none";
            }, 6000);

        } else 
        {
            throw new Error("Hubo un problema al enviar el formulario.");
        }

    } catch (error) 
    {
        mensajeValidacion.classList.add("error");
        mensajeValidacion.textContent = "Hubo un error al enviar el formulario. Por favor, intentá nuevamente.";
        mensajeValidacion.style.display = "block";

    } finally 
    {
        botonEnviar.disabled = false; // Reactivar el botón
    }
});


// Esperamos a que el DOM se haya cargado completamente antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada y script ejecutándose');
    
    // Intentamos cargar el carrito desde localStorage. Si no existe, lo inicializamos como un arreglo vacío
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Seleccionamos todos los elementos de producto en la página
    const productos = document.querySelectorAll('.producto');
    
    // Iteramos sobre cada producto y asignamos el evento de "click" para agregarlo al carrito
    productos.forEach(producto => {
        const botonAgregar = producto.querySelector('.agregar-carrito');
        
        // Cuando el botón de agregar al carrito es clickeado, llamamos a la función agregarAlCarrito
        botonAgregar.addEventListener('click', () => {
            agregarAlCarrito(producto);
        });
    });

    // Función para agregar un producto al carrito
    function agregarAlCarrito(producto) {
        // Extraemos el id, nombre y precio del producto seleccionado
        const id = producto.getAttribute('data-id');
        const nombre = producto.querySelector('h3').textContent;
        const precio = parseFloat(producto.querySelector('p').textContent.replace('$', '').trim());

        console.log(`Producto agregado: ${nombre}, Precio: $${precio}`);

        // Verificamos si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === id);

        // Si el producto ya existe, aumentamos la cantidad. Si no, lo agregamos al carrito con cantidad 1
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                id,
                nombre,
                precio,
                cantidad: 1
            });
        }

        // Guardamos el carrito actualizado en localStorage para que persista después de recargar la página
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Llamamos a la función para actualizar la vista del carrito
        actualizarCarrito();
    }

    // Función para actualizar la visualización del carrito
    function actualizarCarrito() {
        // Limpiamos el contenido actual del carrito en la vista
        const carritoItems = document.getElementById('carrito-items');
        carritoItems.innerHTML = '';

        // Variable para calcular el total del carrito
        let total = 0;

        // Iteramos sobre los productos en el carrito
        carrito.forEach(item => {
            // Creamos un nuevo elemento de lista para mostrar cada producto
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                <button class="editar" data-id="${item.id}">Editar</button>
                <button class="eliminar" data-id="${item.id}">Eliminar</button>
            `;
            carritoItems.appendChild(li);

            // Sumamos el precio total de los productos en el carrito
            total += item.precio * item.cantidad;
        });

        // Actualizamos el total de la compra en la vista
        document.getElementById('total-carrito').textContent = total.toFixed(2);

        // Añadimos los eventos para editar o eliminar productos
        const botonesEditar = document.querySelectorAll('.editar');
        botonesEditar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                editarCantidad(id);
            });
        });

        const botonesEliminar = document.querySelectorAll('.eliminar');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                eliminarDelCarrito(id);
            });
        });
    }

    // Función para editar la cantidad de un producto en el carrito
    function editarCantidad(id) {
        // Pedimos al usuario la nueva cantidad para el producto
        const cantidad = prompt('Ingresa la nueva cantidad:');
        
        // Si la cantidad es válida y es un número positivo, la actualizamos en el carrito
        if (cantidad && !isNaN(cantidad) && cantidad > 0) {
            const item = carrito.find(producto => producto.id === id);
            item.cantidad = parseInt(cantidad); // Convertimos la cantidad a un número entero
            localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardamos el carrito actualizado
            actualizarCarrito(); // Volvemos a actualizar la vista del carrito
        }
    }

    // Función para eliminar un producto del carrito
    function eliminarDelCarrito(id) {
        // Filtramos el carrito eliminando el producto con el id correspondiente
        carrito = carrito.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardamos el carrito actualizado
        actualizarCarrito(); // Actualizamos la vista del carrito
    }

    // Evento para vaciar todo el carrito
    const botonVaciar = document.getElementById('vaciar-carrito');
    botonVaciar.addEventListener('click', () => {
        carrito = []; // Limpiamos el carrito
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardamos el carrito vacío en localStorage
        actualizarCarrito(); // Actualizamos la vista del carrito
    });

    // Inicializamos la visualización del carrito cuando se carga la página
    actualizarCarrito();
});
