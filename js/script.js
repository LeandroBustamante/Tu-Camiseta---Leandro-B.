// Obtener el carrito del localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Selecciona elementos del DOM
const carritoLista = document.getElementById('carrito-lista');
const totalCompra = document.getElementById('total-compra');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const countElement = document.querySelector('.count');

// Función para actualizar el carrito en el DOM
function actualizarCarrito() {
    // Limpiar lista de productos
    carritoLista.innerHTML = '';

    // Calcular el total
    let total = 0;
    carrito.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        productoDiv.innerHTML = `
            <p>${producto.nombre} - $${producto.precio}</p>
            <button class="eliminar" data-id="${producto.id}">Eliminar</button>
        `;
        carritoLista.appendChild(productoDiv);

        total += producto.precio;
    });

    // Mostrar el total
    totalCompra.textContent = `Total: $${total.toFixed(2)}`;

    // Actualizar el contador de productos en el icono del carrito
    countElement.textContent = carrito.length;

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar al carrito
function agregarAlCarrito(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    actualizarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Event listeners
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

// Agregar productos al carrito desde la tienda
const botonesAgregar = document.querySelectorAll('.add-to-cart');
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
        const tarjetaProducto = boton.closest('.card');
        const id = tarjetaProducto.getAttribute('data-id');
        const nombre = `${tarjetaProducto.querySelector("p").textContent} (${tarjetaProducto.querySelector("h3").textContent.trim()})`;
        const precio = parseFloat(tarjetaProducto.querySelector("p:nth-of-type(2)").textContent.replace('$', '').replace(',', ''));
        

        
        agregarAlCarrito(id, nombre, precio);
    });
});

// Eliminar productos del carrito
carritoLista.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar')) {
        const id = event.target.getAttribute('data-id');
        eliminarDelCarrito(id);
    }
});

// Inicializar el carrito en la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarCarrito();
});










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






