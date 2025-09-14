// Sistema de internacionalización para el juego de provincias de España
const i18n = {
    // Idioma actual
    currentLanguage: 'es',
    
    // Diccionario de traducciones
    translations: {
        es: {
            // Encabezado
            'header.title': 'Aprende las Provincias de España',
            'header.subtitle': 'Enumera las provincias de cada comunidad autónoma',
            
            // Juego
            'game.communityLabel': 'Comunidad Autónoma:',
            'game.enumerateProvinces': 'Enumera las provincias',
            'game.indicateCapital': 'Indica la capital',
            'game.writeProvinces': 'Escribe las provincias de esta comunidad autónoma:',
            'game.writeCapital': '¿Cuál es la capital de esta comunidad autónoma?',
            'game.separateWithCommas': 'Separa las provincias con comas',
            'game.writeCapitalPlaceholder': 'Escribe la capital',
            'game.provincesFound': 'Provincias encontradas:',
            'game.check': 'Comprobar',
            'game.hint': 'Pista',
            'game.restart': 'Reiniciar Juego',
            'game.loading': 'Cargando...',
            
            // Mapa
            'map.title': 'Mapa de España',
            'map.hideNames': 'Ocultar nombres',
            'map.showNames': 'Mostrar nombres',
            
            // Resultados
            'results.title': '¡Juego Terminado!',
            'results.congratulations': '¡Enhorabuena! Has completado todas las provincias.',
            'results.totalErrors': 'Total de errores:',
            'results.close': 'Cerrar',
            'results.playAgain': 'Jugar de nuevo',
            
            // Mensajes del juego
            'messages.correct': '¡Correcto!',
            'messages.incorrect': 'Incorrecto. Inténtalo de nuevo.',
            'messages.foundProvinces': '¡Correcto! Encontraste {count} provincia{plural} nueva{plural}.',
            'messages.incorrectProvinces': 'Incorrecto: {provinces}',
            'messages.allProvincesCompleted': '¡Completaste todas las provincias! Ahora responde por la capital.',
            'messages.correctCapital': '¡Correcto! La capital es {capital}',
            'messages.incorrectCapital': 'Incorrecto. La capital de {community} es {capital}',
            'messages.communityCompleted': '¡Comunidad autónoma completada! Pasando a la siguiente...',
            'messages.gameCompleted': '¡Juego completado!',
            'messages.hint': '💡 Pista: Una provincia empieza por "{letter}" y tiene {length} letras.',
            'messages.loadingMap': 'Cargando mapa...',
            'messages.mapError': 'Error al cargar el mapa: {error}'
        },
        
        val: {
            // Encapçalament
            'header.title': 'Aprén les Províncies d\'Espanya',
            'header.subtitle': 'Enumera les províncies de cada comunitat autònoma',
            
            // Joc
            'game.communityLabel': 'Comunitat Autònoma:',
            'game.enumerateProvinces': 'Enumera les províncies',
            'game.indicateCapital': 'Indica la capital',
            'game.writeProvinces': 'Escriu les províncies d\'aquesta comunitat autònoma:',
            'game.writeCapital': 'Quina és la capital d\'aquesta comunitat autònoma?',
            'game.separateWithCommas': 'Separa les províncies amb comes',
            'game.writeCapitalPlaceholder': 'Escriu la capital',
            'game.provincesFound': 'Províncies trobades:',
            'game.check': 'Comprovar',
            'game.hint': 'Pista',
            'game.restart': 'Reiniciar Joc',
            'game.loading': 'Carregant...',
            
            // Mapa
            'map.title': 'Mapa d\'Espanya',
            'map.hideNames': 'Ocultar noms',
            'map.showNames': 'Mostrar noms',
            
            // Resultats
            'results.title': '¡Joc Acabat!',
            'results.congratulations': '¡Enhorabona! Has completat totes les províncies.',
            'results.totalErrors': 'Total d\'errors:',
            'results.close': 'Tancar',
            'results.playAgain': 'Jugar de nou',
            
            // Missatges del joc
            'messages.correct': '¡Correcte!',
            'messages.incorrect': 'Incorrecte. Intenta-ho de nou.',
            'messages.foundProvinces': '¡Correcte! Has trobat {count} província{plural} nova{plural}.',
            'messages.incorrectProvinces': 'Incorrecte: {provinces}',
            'messages.allProvincesCompleted': '¡Has completat totes les províncies! Ara respon per la capital.',
            'messages.correctCapital': '¡Correcte! La capital és {capital}',
            'messages.incorrectCapital': 'Incorrecte. La capital de {community} és {capital}',
            'messages.communityCompleted': '¡Comunitat autònoma completada! Passant a la següent...',
            'messages.gameCompleted': '¡Joc completat!',
            'messages.hint': '💡 Pista: Una província comença per "{letter}" i té {length} lletres.',
            'messages.loadingMap': 'Carregant mapa...',
            'messages.mapError': 'Error en carregar el mapa: {error}'
        }
    },
    
    /**
     * Obtiene una traducción para la clave dada
     * @param {string} key - Clave de traducción
     * @param {Object} params - Parámetros para interpolar en el texto
     * @returns {string} - Texto traducido
     */
    t(key, params = {}) {
        let text = this.translations[this.currentLanguage][key] || key;
        
        // Interpolar parámetros
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
        });
        
        return text;
    },
    
    /**
     * Cambia el idioma actual
     * @param {string} language - Código del idioma ('es' o 'val')
     */
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            this.updatePageTexts();
            // Guardar preferencia en localStorage
            localStorage.setItem('language', language);
        }
    },
    
    /**
     * Obtiene el idioma desde localStorage o usa el predeterminado
     */
    loadLanguage() {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
    },
    
    /**
     * Actualiza todos los textos de la página con las traducciones actuales
     */
    updatePageTexts() {
        // Elementos con atributo data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // Placeholders con atributo data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
    },
    
    /**
     * Inicializa el sistema de internacionalización
     */
    init() {
        this.loadLanguage();
        this.updatePageTexts();
        
        // Configurar el selector de idioma
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = this.currentLanguage;
            languageSelector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
                // Disparar evento personalizado para que otros componentes puedan reaccionar
                window.dispatchEvent(new CustomEvent('languageChanged', {
                    detail: { language: e.target.value }
                }));
            });
        }
    }
};

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});