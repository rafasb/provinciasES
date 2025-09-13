document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const comunidadActualEl = document.getElementById('comunidad-actual');
    const quizForm = document.getElementById('quiz-form');
    const respuestaInput = document.getElementById('respuesta-provincia');
    const feedbackEl = document.getElementById('feedback');
    const resetBtn = document.getElementById('reset-btn');
    const reiniciarModalBtn = document.getElementById('reiniciar-modal-btn');
    const mapaContainer = document.getElementById('mapa-container');
    const resultadoModalEl = document.getElementById('resultadoModal');
    const totalErroresEl = document.getElementById('total-errores');

    const resultadoModal = new bootstrap.Modal(resultadoModalEl);

    // --- ESTADO DEL JUEGO ---
    let comunidadesRestantes = [];
    let provinciasComunidadActual = [];
    let comunidadActual = null;
    let provinciaActual = null;
    let errores = 0;
    let svgMap = null;

    /**
     * Normaliza un string: minúsculas, sin espacios extra y sin tildes.
     * @param {string} str El string a normalizar.
     * @returns {string} El string normalizado.
     */
    const normalizarString = (str) => {
        if (!str) return '';
        return str
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    /**
     * Carga el SVG del mapa en el contenedor.
     */
    const cargarMapa = async () => {
        try {
            const response = await fetch('img/provinciasES.svg');
            if (!response.ok) throw new Error('No se pudo cargar el mapa.');
            const svgText = await response.text();
            mapaContainer.innerHTML = svgText;
            svgMap = mapaContainer.querySelector('svg');
        } catch (error) {
            mapaContainer.innerHTML = `<div class="alert alert-danger">Error al cargar el mapa: ${error.message}</div>`;
            console.error(error);
        }
    };

    /**
     * Inicia o reinicia el juego.
     */
    const iniciarJuego = () => {
        errores = 0;
        comunidadesRestantes = [...comunidades];

        // Limpiar estilos de provincias
        if (svgMap) {
            svgMap.querySelectorAll('.provincia').forEach(p => {
                p.classList.remove('correct', 'highlight');
            });
        }
        
        feedbackEl.innerHTML = '';
        respuestaInput.value = '';
        respuestaInput.disabled = false;
        quizForm.querySelector('button[type="submit"]').disabled = false;

        siguienteComunidad();
    };

    /**
     * Selecciona la siguiente comunidad autónoma de forma aleatoria.
     */
    const siguienteComunidad = () => {
        if (comunidadesRestantes.length === 0) {
            mostrarResultados();
            return;
        }

        const indiceComunidad = Math.floor(Math.random() * comunidadesRestantes.length);
        comunidadActual = comunidadesRestantes[indiceComunidad];
        comunidadesRestantes.splice(indiceComunidad, 1); // Eliminar para no repetir

        comunidadActualEl.textContent = comunidadActual.nombre;
        provinciasComunidadActual = [...comunidadActual.provincias];

        siguienteProvincia();
    };

    /**
     * Selecciona la siguiente provincia de la comunidad actual.
     */
    const siguienteProvincia = () => {
        // Limpiar resaltado anterior
        if (provinciaActual && svgMap) {
            svgMap.getElementById(provinciaActual.id)?.classList.remove('highlight');
        }

        if (provinciasComunidadActual.length === 0) {
            setTimeout(siguienteComunidad, 1000); // Pequeña pausa antes de la siguiente comunidad
            return;
        }

        const indiceProvincia = Math.floor(Math.random() * provinciasComunidadActual.length);
        provinciaActual = provinciasComunidadActual[indiceProvincia];
        provinciasComunidadActual.splice(indiceProvincia, 1);

        // Resaltar nueva provincia
        if (svgMap) {
            const provinciaPath = svgMap.getElementById(provinciaActual.id);
            if (provinciaPath) {
                provinciaPath.classList.add('highlight');
            } else {
                console.error(`No se encontró el path con id: ${provinciaActual.id}`);
                // Si no se encuentra, saltar a la siguiente para no bloquear el juego
                siguienteProvincia();
            }
        }
        
        respuestaInput.focus();
    };

    /**
     * Comprueba la respuesta del usuario.
     * @param {Event} e Evento de envío del formulario.
     */
    const comprobarRespuesta = (e) => {
        e.preventDefault();
        if (!provinciaActual) return;

        const respuestaUsuario = normalizarString(respuestaInput.value);
        const respuestaCorrecta = normalizarString(provinciaActual.nombre);

        if (respuestaUsuario === respuestaCorrecta) {
            feedbackEl.innerHTML = '<div class="alert alert-success">¡Correcto!</div>';
            
            if (svgMap) {
                svgMap.getElementById(provinciaActual.id).classList.add('correct');
            }

            respuestaInput.value = '';
            setTimeout(() => {
                feedbackEl.innerHTML = '';
                siguienteProvincia();
            }, 800);
        } else {
            errores++;
            feedbackEl.innerHTML = '<div class="alert alert-danger">Incorrecto. Inténtalo de nuevo.</div>';
            respuestaInput.value = '';
            respuestaInput.focus();
        }
    };

    /**
     * Muestra la pantalla de resultados finales.
     */
    const mostrarResultados = () => {
        comunidadActualEl.textContent = '¡Juego completado!';
        respuestaInput.disabled = true;
        quizForm.querySelector('button[type="submit"]').disabled = true;
        totalErroresEl.textContent = errores;
        resultadoModal.show();
    };

    /**
     * Función principal que se ejecuta al cargar la página.
     */
    const main = async () => {
        await cargarMapa();
        iniciarJuego();

        quizForm.addEventListener('submit', comprobarRespuesta);
        resetBtn.addEventListener('click', iniciarJuego);
        reiniciarModalBtn.addEventListener('click', () => {
            resultadoModal.hide();
            iniciarJuego();
        });
    };

    main();
});
