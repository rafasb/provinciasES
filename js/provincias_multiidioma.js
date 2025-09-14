// Helper function to get the name in the current language
const getNombre = (item, language = 'es') => {
    return language === 'val' && item.nombreVal ? item.nombreVal : item.nombre;
};

// Helper function to get the capital in the current language
const getCapital = (item, language = 'es') => {
    return language === 'val' && item.capitalVal ? item.capitalVal : item.capital;
};

const comunidades = [
    {
        nombre: "Andalucía",
        nombreVal: "Andalusia",
        capital: "Sevilla",
        capitalVal: "Sevilla",
        provincias: [
            { id: "path580", nombre: "Almería", nombreVal: "Almeria" },
            { id: "path550", nombre: "Cádiz", nombreVal: "Cadis" },
            { id: "path504", nombre: "Córdoba", nombreVal: "Còrdova" },
            { id: "path530", nombre: "Granada", nombreVal: "Granada" },
            { id: "path522", nombre: "Huelva", nombreVal: "Huelva" },
            { id: "path408", nombre: "Jaén", nombreVal: "Jaén" },
            { id: "path596", nombre: "Málaga", nombreVal: "Màlaga" },
            { id: "path446", nombre: "Sevilla", nombreVal: "Sevilla" }
        ]
    },
    {
        nombre: "Aragón",
        nombreVal: "Aragó",
        capital: "Zaragoza",
        capitalVal: "Saragossa",
        provincias: [
            { id: "path452", nombre: "Huesca", nombreVal: "Osca" },
            { id: "path420", nombre: "Teruel", nombreVal: "Terol" },
            { id: "path76", nombre: "Zaragoza", nombreVal: "Saragossa" }
        ]
    },
    {
        nombre: "Asturias",
        nombreVal: "Astúries",
        capital: "Oviedo",
        capitalVal: "Oviedo",
        provincias: [
            { id: "path544", nombre: "Asturias", nombreVal: "Astúries" }
        ]
    },
    {
        nombre: "Cantabria",
        nombreVal: "Cantàbria",
        capital: "Santander",
        capitalVal: "Santander",
        provincias: [
            { id: "path334", nombre: "Cantabria", nombreVal: "Cantàbria" }
        ]
    },
    {
        nombre: "Castilla la Mancha",
        nombreVal: "Castella la Manxa",
        capital: "Toledo",
        capitalVal: "Toledo",
        provincias: [
            { id: "path484", nombre: "Albacete", nombreVal: "Albacete" },
            { id: "path514", nombre: "Ciudad Real", nombreVal: "Ciutat Real" },
            { id: "path440", nombre: "Cuenca", nombreVal: "Conca" },
            { id: "path622", nombre: "Guadalajara", nombreVal: "Guadalajara" },
            { id: "path434", nombre: "Toledo", nombreVal: "Toledo" }
        ]
    },
    {
        nombre: "Castilla y León",
        nombreVal: "Castella i Lleó",
        capital: "Valladolid",
        capitalVal: "Valladolid",
        provincias: [
            { id: "path498", nombre: "Ávila", nombreVal: "Àvila" },
            { id: "path42", nombre: "Burgos", nombreVal: "Burgos" },
            { id: "path404", nombre: "León", nombreVal: "Lleó" },
            { id: "path640", nombre: "Palencia", nombreVal: "Palència" },
            { id: "path590", nombre: "Salamanca", nombreVal: "Salamanca" },
            { id: "path604", nombre: "Segovia", nombreVal: "Segòvia" },
            { id: "path468", nombre: "Soria", nombreVal: "Sòria" },
            { id: "path572", nombre: "Valladolid", nombreVal: "Valladolid" },
            { id: "path538", nombre: "Zamora", nombreVal: "Zamora" }
        ]
    },
    {
        nombre: "Cataluña",
        nombreVal: "Catalunya",
        capital: "Barcelona",
        capitalVal: "Barcelona",
        provincias: [
            { id: "path364", nombre: "Barcelona", nombreVal: "Barcelona" },
            { id: "path648", nombre: "Gerona", nombreVal: "Girona" },
            { id: "path358", nombre: "Lérida", nombreVal: "Lleida" },
            { id: "path688", nombre: "Tarragona", nombreVal: "Tarragona" }
        ]
    },
    {
        nombre: "Ceuta",
        nombreVal: "Ceuta",
        capital: "Ceuta",
        capitalVal: "Ceuta",
        provincias: [
            { id: "path758", nombre: "Ceuta", nombreVal: "Ceuta" }
        ]
    },
    {
        nombre: "Comunidad Valenciana",
        nombreVal: "Comunitat Valenciana",
        capital: "Valencia",
        capitalVal: "València",
        provincias: [
            { id: "path670", nombre: "Alicante", nombreVal: "Alacant" },
            { id: "path678", nombre: "Castellón", nombreVal: "Castelló" },
            { id: "poligon396", nombre: "Valencia", nombreVal: "València" }
        ]
    },
    {
        nombre: "Extremadura",
        nombreVal: "Extremadura",
        capital: "Mérida",
        capitalVal: "Mèrida",
        provincias: [
            { id: "path412", nombre: "Badajoz", nombreVal: "Badajoz" },
            { id: "path426", nombre: "Cáceres", nombreVal: "Càceres" }
        ]
    },
    {
        nombre: "Galicia",
        nombreVal: "Galícia",
        capital: "Santiago de Compostela",
        capitalVal: "Santiago de Compostel·la",
        provincias: [
            { id: "path662", nombre: "La Coruña", nombreVal: "La Corunya" },
            { id: "path460", nombre: "Lugo", nombreVal: "Lugo" },
            { id: "path634", nombre: "Orense", nombreVal: "Ourense" },
            { id: "path722", nombre: "Pontevedra", nombreVal: "Pontevedra" }
        ]
    },
    {
        nombre: "Islas Baleares",
        nombreVal: "Illes Balears",
        capital: "Palma de Mallorca",
        capitalVal: "Palma de Mallorca",
        provincias: [
            { id: "path742", nombre: "Islas Baleares", nombreVal: "Illes Balears" }
        ]
    },
    {
        nombre: "Murcia",
        nombreVal: "Múrcia",
        capital: "Murcia",
        capitalVal: "Múrcia",
        provincias: [
            { id: "path492", nombre: "Murcia", nombreVal: "Múrcia" }
        ]
    },
    {
        nombre: "Navarra",
        nombreVal: "Navarra",
        capital: "Pamplona",
        capitalVal: "Pamplona",
        provincias: [
            { id: "path556", nombre: "Navarra", nombreVal: "Navarra" }
        ]
    },
    {
        nombre: "País Vasco",
        nombreVal: "País Basc",
        capital: "Vitoria-Gasteiz",
        capitalVal: "Vitòria-Gasteiz",
        provincias: [
            { id: "path704", nombre: "Álava", nombreVal: "Àlaba" },
            { id: "path750", nombre: "Guipúzcoa", nombreVal: "Guipúscoa" },
            { id: "path730", nombre: "Vizcaya", nombreVal: "Biscaia" }
        ]
    },
    {
        nombre: "La Rioja",
        nombreVal: "La Rioja",
        capital: "Logroño",
        capitalVal: "Logronyo",
        provincias: [
            { id: "path616", nombre: "La Rioja", nombreVal: "La Rioja" }
        ]
    },
    {
        nombre: "Madrid",
        nombreVal: "Madrid",
        capital: "Madrid",
        capitalVal: "Madrid",
        provincias: [
            { id: "path474", nombre: "Madrid", nombreVal: "Madrid" }
        ]
    },
    {
        nombre: "Melilla",
        nombreVal: "Melilla",
        capital: "Melilla",
        capitalVal: "Melilla",
        provincias: [
            { id: "path764", nombre: "Melilla", nombreVal: "Melilla" }
        ]
    },
    {
        nombre: "Islas Canarias",
        nombreVal: "Illes Canàries",
        capital: "Las Palmas de Gran Canaria / Santa Cruz de Tenerife",
        capitalVal: "Las Palmas de Gran Canària / Santa Cruz de Tenerife",
        provincias: [
            { id: "path712", nombre: "Las Palmas", nombreVal: "Las Palmas" },
            { id: "path736", nombre: "Santa Cruz de Tenerife", nombreVal: "Santa Cruz de Tenerife" }
        ]
    }
];