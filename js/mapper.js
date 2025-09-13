document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const mapaContainer = document.getElementById('mapa-container');
    const svgIdInput = document.getElementById('svg-id');
    const provinceNameInput = document.getElementById('province-name');
    const communityNameInput = document.getElementById('community-name');
    const mappingForm = document.getElementById('mapping-form');
    const outputCodeEl = document.getElementById('output-code');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document-getElementById('copy-btn');
    const copyFeedbackEl = document.getElementById('copy-feedback');

    // --- ESTADO DE LA HERRAMIENTA ---
    let svgMap = null;
    let mappings = {}; // { "Galicia": { nombre: "Galicia", provincias: [...] } }
    let provinceSvgIdMap = {}; // { "path3857": "la-coruna" }

    /**
     * Normaliza un string para usarlo como ID.
     * @param {string} str El string a normalizar.
     * @returns {string} El string normalizado.
     */
    const normalizarParaId = (str) => {
        if (!str) return '';
        return str
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-');
    };

    /**
     * Carga el SVG original y añade los listeners.
     */
    const cargarMapa = async () => {
        try {
            const response = await fetch('img/provinciasES.svg');
            if (!response.ok) throw new Error('No se pudo cargar el mapa.');
            const svgText = await response.text();
            mapaContainer.innerHTML = svgText;
            svgMap = mapaContainer.querySelector('svg');

            // Añadir listeners a cada path que sea una provincia
            svgMap.querySelectorAll('g[id^="g"] > path[id^="path"]').forEach(path => {
                path.classList.add('provincia'); // Añadimos clase para CSS
                path.addEventListener('click', handlePathClick);
            });
        } catch (error) {
            mapaContainer.innerHTML = `<div class="alert alert-danger">Error al cargar el mapa: ${error.message}</div>`;
            console.error(error);
        }
    };

    /**
     * Maneja el clic en una provincia del mapa.
     * @param {Event} e 
     */
    const handlePathClick = (e) => {
        const clickedPath = e.currentTarget;
        const svgId = clickedPath.id;

        // Limpiar resaltado anterior
        svgMap.querySelectorAll('.provincia.highlight').forEach(p => p.classList.remove('highlight'));
        
        // Resaltar el nuevo
        clickedPath.classList.add('highlight');
        svgIdInput.value = svgId;

        // Autocompletar si ya existe el mapeo
        if (provinceSvgIdMap[svgId]) {
            const gameId = provinceSvgIdMap[svgId];
            for (const community in mappings) {
                const province = mappings[community].provincias.find(p => p.id === gameId);
                if (province) {
                    provinceNameInput.value = province.nombre;
                    communityNameInput.value = mappings[community].nombre;
                    break;
                }
            }
        } else {
            provinceNameInput.value = '';
            communityNameInput.value = '';
            provinceNameInput.focus();
        }
    };

    /**
     * Maneja el envío del formulario para añadir un mapeo.
     * @param {Event} e 
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const svgId = svgIdInput.value;
        const provinceName = provinceNameInput.value.trim();
        const communityName = communityNameInput.value.trim();

        if (!svgId || !provinceName || !communityName) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const gameId = normalizarParaId(provinceName);

        // Crear comunidad si no existe
        if (!mappings[communityName]) {
            mappings[communityName] = {
                nombre: communityName,
                provincias: []
            };
        }

        // Añadir o actualizar la provincia
        const provinceData = { id: gameId, nombre: provinceName, svgId: svgId };
        const provinceIndex = mappings[communityName].provincias.findIndex(p => p.svgId === svgId);

        if (provinceIndex > -1) {
            mappings[communityName].provincias[provinceIndex] = provinceData;
        } else {
            mappings[communityName].provincias.push(provinceData);
        }
        
        provinceSvgIdMap[svgId] = gameId;

        // Marcar como mapeada
        svgMap.getElementById(svgId)?.classList.add('mapped');
        svgMap.getElementById(svgId)?.classList.remove('highlight');

        // Limpiar formulario
        svgIdInput.value = '';
        provinceNameInput.value = '';
        communityNameInput.value = '';
    };

    /**
     * Genera el código JavaScript para provincias.js.
     */
    const handleGenerateClick = () => {
        const comunidadesArray = Object.values(mappings);
        
        // Ordenar comunidades alfabéticamente
        comunidadesArray.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        // Ordenar provincias dentro de cada comunidad
        comunidadesArray.forEach(comunidad => {
            comunidad.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
        });

        // Generar el string de código
        let codeString = 'const comunidades = [\n';
        comunidadesArray.forEach((comunidad, index) => {
            codeString += '    {\n';
            codeString += `        nombre: "${comunidad.nombre}",\n`;
            codeString += '        provincias: [\n';
            comunidad.provincias.forEach((provincia, pIndex) => {
                // Usamos el svgId original como el 'id' para el juego, que es lo que se necesita para encontrar el elemento en el mapa.
                codeString += `            { id: "${provincia.svgId}", nombre: "${provincia.nombre}" }`;
                codeString += (pIndex < comunidad.provincias.length - 1) ? ',\n' : '\n';
            });
            codeString += '        ]\n';
            codeString += '    }';
            codeString += (index < comunidadesArray.length - 1) ? ',\n' : '\n';
        });
        codeString += '];\n';

        outputCodeEl.value = codeString;
    };

    /**
     * Copia el código generado al portapapeles.
     */
    const handleCopyClick = () => {
        if (!outputCodeEl.value) {
            alert('Primero genera el código.');
            return;
        }
        navigator.clipboard.writeText(outputCodeEl.value).then(() => {
            copyFeedbackEl.innerHTML = '<div class="alert alert-success p-1 text-center">¡Copiado!</div>';
            setTimeout(() => { copyFeedbackEl.innerHTML = ''; }, 2000);
        }).catch(err => {
            copyFeedbackEl.innerHTML = '<div class="alert alert-danger p-1 text-center">Error al copiar.</div>';
            console.error('Error al copiar: ', err);
        });
    };

    /**
     * Función principal.
     */
    const main = async () => {
        await cargarMapa();
        mappingForm.addEventListener('submit', handleFormSubmit);
        generateBtn.addEventListener('click', handleGenerateClick);
        copyBtn.addEventListener('click', handleCopyClick);
    };

    main();
});
