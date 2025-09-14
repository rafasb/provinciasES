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
    const languageSelector = document.getElementById('language-selector');

    const resultadoModal = new bootstrap.Modal(resultadoModalEl);

    // --- TRADUCCIONES SIMPLIFICADAS ---
    const textos = {
        es: {
            enumerateProvinces: 'Enumera las provincias',
            writeProvinces: 'Escribe las provincias de esta comunidad autónoma:',
            separateWithCommas: 'Separa las provincias con comas',
            indicateCapital: 'Indica la capital',
            whatIsCapital: '¿Cuál es la capital de esta comunidad autónoma?',
            writeCapital: 'Escribe la capital',
            hint: 'Pista',
            provinceStartsWith: 'Una provincia empieza por',
            hasLetters: 'y tiene',
            letters: 'letras',
            correct: '¡Correcto!',
            found: 'Encontraste',
            provinces: 'provincias',
            province: 'provincia',
            new_plural: 'nuevas',
            new_singular: 'nueva',
            incorrect: 'Incorrecto',
            completedProvinces: '¡Completaste todas las provincias! Ahora responde por la capital.',
            capitalIs: 'La capital es',
            communityCompleted: '¡Comunidad autónoma completada! Pasando a la siguiente...',
            capitalOf: 'La capital de',
            is: 'es',
            gameCompleted: '¡Juego completado!',
            hideNames: 'Ocultar nombres',
            showNames: 'Mostrar nombres'
        },
        val: {
            enumerateProvinces: 'Enumera les províncies',
            writeProvinces: 'Escriu les províncies d\'aquesta comunitat autònoma:',
            separateWithCommas: 'Separa les províncies amb comes',
            indicateCapital: 'Indica la capital',
            whatIsCapital: 'Quina és la capital d\'aquesta comunitat autònoma?',
            writeCapital: 'Escriu la capital',
            hint: 'Pista',
            provinceStartsWith: 'Una província comença per',
            hasLetters: 'i té',
            letters: 'lletres',
            correct: 'Correcte!',
            found: 'Has trobat',
            provinces: 'províncies',
            province: 'província',
            new_plural: 'noves',
            new_singular: 'nova',
            incorrect: 'Incorrecte',
            completedProvinces: 'Has completat totes les províncies! Ara respon per la capital.',
            capitalIs: 'La capital és',
            communityCompleted: 'Comunitat autònoma completada! Passant a la següent...',
            capitalOf: 'La capital de',
            is: 'és',
            gameCompleted: 'Joc completat!',
            hideNames: 'Ocultar noms',
            showNames: 'Mostrar noms'
        }
    };

    // --- ESTADO DEL JUEGO ---
    let comunidadesRestantes = [];
    let comunidadActual = null;
    let modoActual = 'provincias';
    let errores = 0;
    let svgMap = null;
    let mostrarNombres = true;
    let provinciasEncontradas = new Set();
    let pistasUsadas = 0;
    let capitalCompletada = false;
    let idiomaActual = 'es';

    /**
     * Obtiene texto traducido
     */
    const t = (key, fallback = key) => {
        return textos[idiomaActual]?.[key] || fallback;
    };

    /**
     * Normaliza un string: minúsculas, sin espacios extra y sin tildes.
     */
    const normalizarString = (str) => {
        if (!str) return '';
        return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    /**
     * Carga el SVG del mapa en el contenedor.
     */
    const cargarMapa = async () => {
        try {
            const rutaArchivo = mostrarNombres ? 'img/provinciasES.svg' : 'img/provinciasES_sinNombres.svg';
            const response = await fetch(rutaArchivo);
            if (!response.ok) throw new Error('No se pudo cargar el mapa.');
            const svgText = await response.text();
            mapaContainer.innerHTML = svgText;
            svgMap = mapaContainer.querySelector('svg');
            
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
        }
    };

    /**
     * Alterna entre mostrar/ocultar nombres en el mapa.
     */
    const toggleNombres = async () => {
        mostrarNombres = !mostrarNombres;
        const icon = toggleNombresBtn?.querySelector('i');
        if (icon && toggleTextEl) {
            if (mostrarNombres) {
                icon.className = 'bi bi-eye-slash me-1';
                toggleTextEl.textContent = t('hideNames');
            } else {
                icon.className = 'bi bi-eye me-1';
                toggleTextEl.textContent = t('showNames');
            }
        }
        await cargarMapa();
    };

    /**
     * Obtiene los datos de la comunidad en el idioma actual.
     */
    const obtenerDatosComunidad = (comunidad) => {
        if (idiomaActual === 'val') {
            return {
                nombre: comunidad.nombreVal || comunidad.nombre,
                capital: comunidad.capitalVal || comunidad.capital,
                provincias: comunidad.provincias.map(p => ({
                    id: p.id,
                    nombre: p.nombreVal || p.nombre
                }))
            };
        } else {
            return {
                nombre: comunidad.nombre,
                capital: comunidad.capital,
                provincias: comunidad.provincias.map(p => ({
                    id: p.id,
                    nombre: p.nombre
                }))
            };
        }
    };

    /**
     * Configura la interfaz para el modo de provincias.
     */
    const configurarModoProvincias = () => {
        const datos = obtenerDatosComunidad(comunidadActual);
        if (tipoPreguntaEl) tipoPreguntaEl.textContent = t('enumerateProvinces');
        if (preguntaTextoEl) preguntaTextoEl.textContent = t('writeProvinces');
        if (respuestaInput) respuestaInput.placeholder = t('separateWithCommas');
        if (totalProvinciasEl) totalProvinciasEl.textContent = datos.provincias.length;
        if (provinciasEncontradasEl) provinciasEncontradasEl.textContent = provinciasEncontradas.size;
        if (pistaBtn) pistaBtn.style.display = 'inline-block';
    };

    /**
     * Configura la interfaz para el modo de capital.
     */
    const configurarModoCapital = () => {
        if (tipoPreguntaEl) tipoPreguntaEl.textContent = t('indicateCapital');
        if (preguntaTextoEl) preguntaTextoEl.textContent = t('whatIsCapital');
        if (respuestaInput) respuestaInput.placeholder = t('writeCapital');
        if (totalProvinciasEl) totalProvinciasEl.textContent = '1';
        if (provinciasEncontradasEl) provinciasEncontradasEl.textContent = capitalCompletada ? '1' : '0';
        if (pistaBtn) pistaBtn.style.display = 'none';
    };

    /**
     * Cambia el idioma de la interfaz.
     */
    const cambiarIdioma = (nuevoIdioma) => {
        idiomaActual = nuevoIdioma;
        
        if (comunidadActual) {
            const datosActualizados = obtenerDatosComunidad(comunidadActual);
            if (comunidadActualEl) comunidadActualEl.textContent = datosActualizados.nombre;
            
            if (modoActual === 'provincias') {
                configurarModoProvincias();
            } else {
                configurarModoCapital();
            }
        }
        
        // Actualizar botón de toggle
        if (toggleTextEl) {
            toggleTextEl.textContent = mostrarNombres ? t('hideNames') : t('showNames');
        }
    };

    /**
     * Inicia o reinicia el juego.
     */
    const iniciarJuego = () => {
        errores = 0;
        comunidadesRestantes = [...comunidades];
        provinciasEncontradas.clear();
        pistasUsadas = 0;

        if (svgMap) {
            svgMap.querySelectorAll('path, polygon').forEach(element => {
                element.classList.remove('correct', 'highlight');
            });
        }
        
        if (feedbackEl) feedbackEl.innerHTML = '';
        if (respuestaInput) {
            respuestaInput.value = '';
            respuestaInput.disabled = false;
        }
        if (quizForm) {
            const submitBtn = quizForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = false;
        }
        if (pistaBtn) pistaBtn.disabled = false;

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

        const datos = obtenerDatosComunidad(comunidadActual);
        if (comunidadActualEl) comunidadActualEl.textContent = datos.nombre;
        provinciasEncontradas.clear();
        pistasUsadas = 0;
        capitalCompletada = false;
        
        modoActual = 'provincias';
        configurarModoProvincias();
        
        if (respuestaInput) respuestaInput.focus();
    };

    /**
     * Proporciona una pista al usuario.
     */
    const darPista = () => {
        if (modoActual !== 'provincias' || !comunidadActual) return;
        
        const datos = obtenerDatosComunidad(comunidadActual);
        const provinciasRestantes = datos.provincias.filter(p => 
            !provinciasEncontradas.has(normalizarString(p.nombre)));
        
        if (provinciasRestantes.length === 0) return;
        
        const provinciaAleatoria = provinciasRestantes[Math.floor(Math.random() * provinciasRestantes.length)];
        const primeraLetra = provinciaAleatoria.nombre.charAt(0).toUpperCase();
        const longitud = provinciaAleatoria.nombre.length;
        
        pistasUsadas++;
        if (feedbackEl) {
            feedbackEl.innerHTML = `<div class="alert alert-info">💡 ${t('hint')}: ${t('provinceStartsWith')} "${primeraLetra}" ${t('hasLetters')} ${longitud} ${t('letters')}.</div>`;
        }
        
        setTimeout(() => {
            if (feedbackEl && feedbackEl.innerHTML.includes('💡')) {
                feedbackEl.innerHTML = '';
            }
        }, 4000);
    };

    /**
     * Comprueba las respuestas del usuario.
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
     */
    const comprobarProvincias = (respuestaUsuario) => {
        const provinciasIntroducidas = respuestaUsuario.split(',').map(p => p.trim()).filter(p => p.length > 0);
        const datos = obtenerDatosComunidad(comunidadActual);
        let nuevasEncontradas = 0;
        let respuestasIncorrectas = [];

        provinciasIntroducidas.forEach(provinciaUsuario => {
            const provinciaUsuarioNorm = normalizarString(provinciaUsuario);
            
            if (provinciasEncontradas.has(provinciaUsuarioNorm)) return;
            
            const provinciaCorrecta = datos.provincias.find(p => 
                normalizarString(p.nombre) === provinciaUsuarioNorm);
            
            if (provinciaCorrecta) {
                provinciasEncontradas.add(provinciaUsuarioNorm);
                nuevasEncontradas++;
                
                if (svgMap) {
                    const element = svgMap.getElementById(provinciaCorrecta.id);
                    if (element) element.classList.add('correct');
                }
            } else {
                respuestasIncorrectas.push(provinciaUsuario);
            }
        });

        if (provinciasEncontradasEl) provinciasEncontradasEl.textContent = provinciasEncontradas.size;

        let feedback = '';
        if (nuevasEncontradas > 0) {
            const provinciaTexto = nuevasEncontradas > 1 ? t('provinces') : t('province');
            const nuevaTexto = nuevasEncontradas > 1 ? t('new_plural') : t('new_singular');
            feedback += `<div class="alert alert-success">${t('correct')} ${t('found')} ${nuevasEncontradas} ${provinciaTexto} ${nuevaTexto}.</div>`;
        }
        if (respuestasIncorrectas.length > 0) {
            errores += respuestasIncorrectas.length;
            feedback += `<div class="alert alert-danger">${t('incorrect')}: ${respuestasIncorrectas.join(', ')}</div>`;
        }

        if (feedbackEl) feedbackEl.innerHTML = feedback;
        if (respuestaInput) respuestaInput.value = '';

        if (provinciasEncontradas.size === datos.provincias.length) {
            setTimeout(() => {
                if (feedbackEl) feedbackEl.innerHTML = `<div class="alert alert-success">${t('completedProvinces')}</div>`;
                setTimeout(() => {
                    modoActual = 'capital';
                    configurarModoCapital();
                    if (feedbackEl) feedbackEl.innerHTML = '';
                    if (respuestaInput) respuestaInput.focus();
                }, 2000);
            }, 1000);
        }
    };

    /**
     * Comprueba la capital introducida por el usuario.
     */
    const comprobarCapital = (respuestaUsuario) => {
        const datos = obtenerDatosComunidad(comunidadActual);
        const respuestaUsuarioNorm = normalizarString(respuestaUsuario);
        const capitalCorrectaNorm = normalizarString(datos.capital);

        if (respuestaUsuarioNorm === capitalCorrectaNorm) {
            capitalCompletada = true;
            feedbackEl.innerHTML = `<div class="alert alert-success">${t('correct')} ${t('capitalIs')} ${datos.capital}</div>`;
            if (provinciasEncontradasEl) provinciasEncontradasEl.textContent = '1';
            
            setTimeout(() => {
                if (feedbackEl) feedbackEl.innerHTML = `<div class="alert alert-info">${t('communityCompleted')}</div>`;
                setTimeout(() => {
                    if (feedbackEl) feedbackEl.innerHTML = '';
                    siguienteComunidad();
                }, 1500);
            }, 1500);
        } else {
            errores++;
            if (feedbackEl) feedbackEl.innerHTML = `<div class="alert alert-danger">${t('incorrect')}. ${t('capitalOf')} ${datos.nombre} ${t('is')} ${datos.capital}</div>`;
            
            setTimeout(() => {
                capitalCompletada = true;
                if (provinciasEncontradasEl) provinciasEncontradasEl.textContent = '1';
                setTimeout(() => {
                    if (feedbackEl) feedbackEl.innerHTML = '';
                    siguienteComunidad();
                }, 1000);
            }, 2500);
        }
        
        if (respuestaInput) respuestaInput.value = '';
    };

    /**
     * Muestra la pantalla de resultados finales.
     */
    const mostrarResultados = () => {
        if (comunidadActualEl) comunidadActualEl.textContent = t('gameCompleted');
        if (tipoPreguntaEl) tipoPreguntaEl.textContent = '';
        if (respuestaInput) respuestaInput.disabled = true;
        if (quizForm) quizForm.querySelector('button[type="submit"]').disabled = true;
        if (pistaBtn) pistaBtn.disabled = true;
        if (totalErroresEl) totalErroresEl.textContent = errores;
        resultadoModal.show();
    };

    // Inicialización
    cargarMapa().then(() => iniciarJuego());

    // Event listeners
    if (quizForm) quizForm.addEventListener('submit', comprobarRespuesta);
    if (resetBtn) resetBtn.addEventListener('click', iniciarJuego);
    if (pistaBtn) pistaBtn.addEventListener('click', darPista);
    if (toggleNombresBtn) toggleNombresBtn.addEventListener('click', toggleNombres);
    if (languageSelector) languageSelector.addEventListener('change', (e) => cambiarIdioma(e.target.value));
    if (reiniciarModalBtn) {
        reiniciarModalBtn.addEventListener('click', () => {
            resultadoModal.hide();
            iniciarJuego();
        });
    }
});
