
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
