document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const comunidadActualEl = document.getElementById('comunidad-actual');
    const tipoPreguntaEl = document.getElementById('tipo-pregunta');
    const preguntaTextoEl = document.getElementById('pregunta-texto');
    const quizForm = document.getElementById('quiz-form');
    const respuestaInput = document.getElementById('respuesta-input');
    const feedbackEl = document.getElementById('feedback');
    const resetBtn = document.getElementById('reset-btn');
    const pistaBtn = document.getElementById('pista-btn');
    const reiniciarModalBtn = document.getElementById('reiniciar-modal-btn');
    const mapaContainer = document.getElementById('mapa-container');
    const resultadoModalEl = document.getElementById('resultadoModal');
    const totalErroresEl = document.getElementById('total-errores');
    const toggleNombresBtn = document.getElementById('toggle-nombres');
    const toggleTextEl = document.getElementById('toggle-text');
    const provinciasEncontradasEl = document.getElementById('provincias-encontradas');
    const totalProvinciasEl = document.getElementById('total-provincias');

    const resultadoModal = new bootstrap.Modal(resultadoModalEl);

    // --- ESTADO DEL JUEGO ---
    let comunidadesRestantes = [];
    let comunidadActual = null;
    let modoActual = 'provincias'; // 'provincias' o 'capital'
    let errores = 0;
    let svgMap = null;
    let mostrarNombres = true;
    let provinciasEncontradas = new Set();
    let pistasUsadas = 0;

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
            const rutaArchivo = mostrarNombres ? 
                'img/provinciasES.svg' : 
                'img/provinciasES_sinNombres.svg';
            
            const response = await fetch(rutaArchivo);
            if (!response.ok) throw new Error('No se pudo cargar el mapa.');
            const svgText = await response.text();
            mapaContainer.innerHTML = svgText;
            svgMap = mapaContainer.querySelector('svg');
            
            // Aplicar estilos a provincias si están encontradas
            if (svgMap && provinciasEncontradas.size > 0) {
                provinciasEncontradas.forEach(nombreProvincia => {
                    const provincia = comunidadActual?.provincias.find(p => 
                        normalizarString(p.nombre) === normalizarString(nombreProvincia));
                    if (provincia) {
                        const element = svgMap.getElementById(provincia.id);
                        if (element) element.classList.add('correct');
                    }
                });
            }
            
        } catch (error) {
            mapaContainer.innerHTML = `<div class="alert alert-danger">Error al cargar el mapa: ${error.message}</div>`;
            console.error(error);
        }
    };

    /**
     * Alterna entre mostrar/ocultar nombres en el mapa.
     */
    const toggleNombres = async () => {
        mostrarNombres = !mostrarNombres;
        
        // Actualizar el botón
        const icon = toggleNombresBtn.querySelector('i');
        if (mostrarNombres) {
            icon.className = 'bi bi-eye-slash me-1';
            toggleTextEl.textContent = 'Ocultar nombres';
        } else {
            icon.className = 'bi bi-eye me-1';
            toggleTextEl.textContent = 'Mostrar nombres';
        }
        
        // Recargar el mapa
        await cargarMapa();
    };

    /**
     * Inicia o reinicia el juego.
     */
    const iniciarJuego = () => {
        errores = 0;
        comunidadesRestantes = [...comunidades];
        provinciasEncontradas.clear();
        pistasUsadas = 0;

        // Limpiar estilos de provincias
        if (svgMap) {
            svgMap.querySelectorAll('path, polygon').forEach(element => {
                element.classList.remove('correct', 'highlight');
            });
        }
        
        feedbackEl.innerHTML = '';
        respuestaInput.value = '';
        respuestaInput.disabled = false;
        quizForm.querySelector('button[type="submit"]').disabled = false;
        pistaBtn.disabled = false;

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
        comunidadesRestantes.splice(indiceComunidad, 1);

        comunidadActualEl.textContent = comunidadActual.nombre;
        provinciasEncontradas.clear();
        pistasUsadas = 0;
        
        // Alternar entre preguntar provincias y capital
        modoActual = Math.random() < 0.8 ? 'provincias' : 'capital'; // 80% provincias, 20% capital
        
        if (modoActual === 'provincias') {
            tipoPreguntaEl.textContent = 'Enumera las provincias';
            preguntaTextoEl.textContent = 'Escribe las provincias de esta comunidad autónoma:';
            respuestaInput.placeholder = 'Separa las provincias con comas';
            totalProvinciasEl.textContent = comunidadActual.provincias.length;
            provinciasEncontradasEl.textContent = '0';
            pistaBtn.style.display = 'inline-block';
        } else {
            tipoPreguntaEl.textContent = 'Indica la capital';
            preguntaTextoEl.textContent = '¿Cuál es la capital de esta comunidad autónoma?';
            respuestaInput.placeholder = 'Escribe la capital';
            totalProvinciasEl.textContent = '1';
            provinciasEncontradasEl.textContent = '0';
            pistaBtn.style.display = 'none';
        }
        
        respuestaInput.focus();
    };

    /**
     * Proporciona una pista al usuario.
     */
    const darPista = () => {
        if (modoActual !== 'provincias' || !comunidadActual) return;
        
        const provinciasRestantes = comunidadActual.provincias.filter(p => 
            !provinciasEncontradas.has(normalizarString(p.nombre)));
        
        if (provinciasRestantes.length === 0) return;
        
        const provinciaAleatoria = provinciasRestantes[Math.floor(Math.random() * provinciasRestantes.length)];
        const primeraLetra = provinciaAleatoria.nombre.charAt(0).toUpperCase();
        const longitud = provinciaAleatoria.nombre.length;
        
        pistasUsadas++;
        feedbackEl.innerHTML = `<div class="alert alert-info">💡 Pista: Una provincia empieza por "${primeraLetra}" y tiene ${longitud} letras.</div>`;
        
        setTimeout(() => {
            if (feedbackEl.innerHTML.includes('💡 Pista:')) {
                feedbackEl.innerHTML = '';
            }
        }, 4000);
    };

    /**
     * Comprueba las respuestas del usuario.
     * @param {Event} e Evento de envío del formulario.
     */
    const comprobarRespuesta = (e) => {
        e.preventDefault();
        if (!comunidadActual) return;

        const respuestaUsuario = respuestaInput.value.trim();
        
        if (modoActual === 'provincias') {
            comprobarProvincias(respuestaUsuario);
        } else {
            comprobarCapital(respuestaUsuario);
        }
    };

    /**
     * Comprueba las provincias introducidas por el usuario.
     * @param {string} respuestaUsuario 
     */
    const comprobarProvincias = (respuestaUsuario) => {
        const provinciasIntroducidas = respuestaUsuario
            .split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0);

        let nuevasEncontradas = 0;
        let respuestasIncorrectas = [];

        provinciasIntroducidas.forEach(provinciaUsuario => {
            const provinciaUsuarioNorm = normalizarString(provinciaUsuario);
            
            // Verificar si ya fue encontrada
            if (provinciasEncontradas.has(provinciaUsuarioNorm)) {
                return;
            }
            
            // Buscar en las provincias de la comunidad actual
            const provinciaCorrecta = comunidadActual.provincias.find(p => 
                normalizarString(p.nombre) === provinciaUsuarioNorm);
            
            if (provinciaCorrecta) {
                provinciasEncontradas.add(provinciaUsuarioNorm);
                nuevasEncontradas++;
                
                // Marcar en el mapa
                if (svgMap) {
                    const element = svgMap.getElementById(provinciaCorrecta.id);
                    if (element) element.classList.add('correct');
                }
            } else {
                respuestasIncorrectas.push(provinciaUsuario);
            }
        });

        // Actualizar contador
        provinciasEncontradasEl.textContent = provinciasEncontradas.size;

        // Mostrar feedback
        let feedback = '';
        if (nuevasEncontradas > 0) {
            feedback += `<div class="alert alert-success">¡Correcto! Encontraste ${nuevasEncontradas} provincia${nuevasEncontradas > 1 ? 's' : ''} nueva${nuevasEncontradas > 1 ? 's' : ''}.</div>`;
        }
        if (respuestasIncorrectas.length > 0) {
            errores += respuestasIncorrectas.length;
            feedback += `<div class="alert alert-danger">Incorrecto: ${respuestasIncorrectas.join(', ')}</div>`;
        }

        feedbackEl.innerHTML = feedback;
        respuestaInput.value = '';

        // Verificar si se completó la comunidad
        if (provinciasEncontradas.size === comunidadActual.provincias.length) {
            setTimeout(() => {
                feedbackEl.innerHTML = '<div class="alert alert-success">¡Completaste todas las provincias de esta comunidad!</div>';
                setTimeout(siguienteComunidad, 1500);
            }, 1000);
        }
    };

    /**
     * Comprueba la capital introducida por el usuario.
     * @param {string} respuestaUsuario 
     */
    const comprobarCapital = (respuestaUsuario) => {
        const respuestaUsuarioNorm = normalizarString(respuestaUsuario);
        const capitalCorrectaNorm = normalizarString(comunidadActual.capital);

        if (respuestaUsuarioNorm === capitalCorrectaNorm) {
            feedbackEl.innerHTML = '<div class="alert alert-success">¡Correcto! La capital es ' + comunidadActual.capital + '</div>';
            provinciasEncontradasEl.textContent = '1';
            
            setTimeout(() => {
                feedbackEl.innerHTML = '';
                siguienteComunidad();
            }, 1500);
        } else {
            errores++;
            feedbackEl.innerHTML = '<div class="alert alert-danger">Incorrecto. La capital de ' + comunidadActual.nombre + ' es ' + comunidadActual.capital + '</div>';
            
            setTimeout(() => {
                siguienteComunidad();
            }, 2500);
        }
        
        respuestaInput.value = '';
    };

    /**
     * Muestra la pantalla de resultados finales.
     */
    const mostrarResultados = () => {
        comunidadActualEl.textContent = '¡Juego completado!';
        tipoPreguntaEl.textContent = '';
        respuestaInput.disabled = true;
        quizForm.querySelector('button[type="submit"]').disabled = true;
        pistaBtn.disabled = true;
        totalErroresEl.textContent = errores;
        resultadoModal.show();
    };

    /**
     * Función principal que se ejecuta al cargar la página.
     */
    const main = async () => {
        await cargarMapa();
        iniciarJuego();

        // Event listeners
        quizForm.addEventListener('submit', comprobarRespuesta);
        resetBtn.addEventListener('click', iniciarJuego);
        pistaBtn.addEventListener('click', darPista);
        toggleNombresBtn.addEventListener('click', toggleNombres);
        reiniciarModalBtn.addEventListener('click', () => {
            resultadoModal.hide();
            iniciarJuego();
        });
    };

    main();
});
