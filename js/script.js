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
        // Crear una fila para cada producto
        const fila = document.createElement('tr');

        // Formatear precio y total con puntos como separadores de miles
        const precioFormateado = producto.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        const totalProducto = (producto.precio * producto.cantidad).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${precioFormateado}</td>
            <td><button class="btn-eliminar" data-id="${producto.id}"><i class="fas fa-trash-alt"></i> <!-- Ícono de basura --></button></td>

        `;
        
        
        carritoLista.appendChild(fila);

        total += producto.precio * producto.cantidad;
    });

    // Mostrar el total con formato
    totalCompra.textContent = `Total: ${total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`;

    // Actualizar el contador de productos en el icono del carrito
    countElement.textContent = carrito.length;

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar al carrito
function agregarAlCarrito(id, nombre, precio) {
    carrito.push({ id, nombre, precio, cantidad: 1 });
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
        const precio = parseFloat(tarjetaProducto.querySelector("p:nth-of-type(2)").textContent.replace('$', '').replace(/\./g, '').replace(',', '.'));

        agregarAlCarrito(id, nombre, precio);
    });
});

// Eliminar productos del carrito
carritoLista.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-eliminar') || event.target.closest('.btn-eliminar')) {
        const id = event.target.getAttribute('data-id') || event.target.closest('.btn-eliminar').getAttribute('data-id');
        eliminarDelCarrito(id);
    }
});

// Actualizar la cantidad de productos
carritoLista.addEventListener('change', (event) => {
    if (event.target.classList.contains('cantidad-producto')) {
        const id = event.target.getAttribute('data-id');
        const cantidad = parseInt(event.target.value);

        if (cantidad > 0) {
            // Actualizar la cantidad del producto
            const producto = carrito.find(p => p.id === id);
            if (producto) {
                producto.cantidad = cantidad;
                actualizarCarrito();
            }
        } else {
            alert("La cantidad no puede ser menor que 1.");
        }
    }
});

// Inicializar el carrito en la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarCarrito();
});





