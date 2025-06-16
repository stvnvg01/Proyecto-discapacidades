const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const sitios = {
    "tunel de la quiebra": {
    nombre: "Túnel de La Quiebra",
    descripcion: "Histórico túnel ferroviario que conectaba Medellín con el Magdalena Medio.",
    imagen: "photos/tunel.jpg",
    keywords: ["historia", "trenes", "ferrocarril", "túnel", "quiebra", "Sitios turísticos"]

    },
    "vaporina la 45": {
    nombre: "Vaporina la 45",
    descripcion: "Primer locomotora en cruzar el Túnel de la Quiebra con tripulación.",
    imagen: "photos/locomotora.jpg",
    keywords: ["locomotora", "tren", "historia", "ferrocarril", "mecánica", "Sitios turísticos"]
    },
    "charcos de cisneros": {
    nombre: "Charcos de Cisneros",
    descripcion: "Hermosas piscinas naturales, rodeadas de exuberante vegetación.",
    imagen: "photos/charco.jpg",
    keywords: ["agua", "charco", "naturaleza", "piscina", "turismo ecológico", "Sitios turísticos"]
    },

    "mirador el carmelo": {
    nombre: "Mirador El Carmelo",
    descripcion: "Punto panorámico que ofrece vistas espectaculares del valle.",
    imagen: "photos/Mirador.jpg",
    keywords: ["mirador", "paisaje", "vista", "valle", "fotografía", "panorámico", "Sitios turísticos"]
    }
};

if (!SpeechRecognition) {
    alert("Tu navegador no soporta reconocimiento de voz.");
} else {
    const reconocimiento = new SpeechRecognition();
    reconocimiento.lang = "es-ES";
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    const btnHablar = document.getElementById("btnHablar");
    const entradaTexto = document.getElementById("entradaTexto");
    const resultados = document.getElementById("resultados");
    const sitiosContainer = document.getElementById("sitiosContainer");

  // Mostrar todos los sitios al cargar la página
    window.onload = () => {
    mostrarSitiosIniciales();
};

    btnHablar.addEventListener("click", () => {
    hablar("Escuchando...");
    reconocimiento.start();
});

    reconocimiento.onresult = (event) => {
    const texto = event.results[0][0].transcript.toLowerCase().trim();
    entradaTexto.value = texto;

    //
    buscarSitioEspecifico(texto);


};

function mostrarSitiosIniciales() {
    sitiosContainer.innerHTML = "";
    Object.values(sitios).forEach(sitio => {
        const div = document.createElement("div");
        div.className = "sitio";
        div.innerHTML = `
        <h3>${sitio.nombre}</h3>
        <img src="${sitio.imagen}" alt="${sitio.nombre}">
        <p>${sitio.descripcion}</p>
        `;
        div.querySelector("h3").addEventListener("click", () => {
        hablar(`${sitio.nombre}. ${sitio.descripcion}`);
        });
    sitiosContainer.appendChild(div);
    });
}
// Buscar al escribir manualmente en el campo de texto
entradaTexto.addEventListener("input", () => {
  const texto = entradaTexto.value.toLowerCase().trim();
  buscarSitioEspecifico(texto);
});

// Limpiar búsqueda al hacer clic
document.getElementById("btnLimpiar").addEventListener("click", () => {
  entradaTexto.value = "";
  resultados.innerHTML = "";
  hablar("Búsqueda limpiada. Mostrando todos los sitios turísticos.");
  Object.values(sitios).forEach(sitio => mostrarSitio(sitio));
});

function mostrarSitio(sitio) {
    const div = document.createElement("div");
    div.className = "sitio";
    div.innerHTML = `
    <h3>${sitio.nombre}</h3>
    <p>${sitio.descripcion}</p>
    <img src="${sitio.imagen}" alt="${sitio.nombre}">
    `;
    div.querySelector("h3").addEventListener("click", () => {
    hablar(`${sitio.nombre}. ${sitio.descripcion}`);
    });
    resultados.appendChild(div);
}

function mostrarTodosLosSitios(texto) {
    resultados.innerHTML = "";
    const total = Object.keys(sitios).length;
    hablar(`Se encontraron ${total} sitios turísticos.`);
    Object.values(sitios).forEach(sitio => {
    mostrarSitio(sitio);
    });
}

function buscarSitioEspecifico(textoUsuario) {
    resultados.innerHTML = "";

    // Convertimos la frase en palabras individuales (tokens) ignorando tildes y signos
    const palabrasClave = textoUsuario
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/[.,;!?¿¡]/g, "")
        .split(" ")
        .filter(p => p.length > 2); // eliminamos palabras demasiado cortas

    // Filtro tipo AND: solo devuelve sitios que contengan *todas* las palabras
    const coincidencias = Object.values(sitios).filter(sitio => {
        const contenido = (
            sitio.nombre + " " +
            sitio.descripcion + " " +
            (sitio.keywords || []).join(" ")
        ).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        return palabrasClave.every(palabra =>
            contenido.includes(palabra)
        );
    });

    // Mostrar resultados si hubo coincidencias
    if (coincidencias.length > 0) {
        hablar(`Se encontraron ${coincidencias.length} resultado${coincidencias.length > 1 ? "s" : ""} relacionados.`);
        coincidencias.forEach(sitio => {
            mostrarSitio(sitio);
            hablar(`${sitio.nombre}. ${sitio.descripcion}`);
        });
    } else {
        resultados.innerHTML = "<p>No se encontró contenido relacionado.</p>";
        hablar("No encontré resultados relacionados con lo que dijiste.");
    }
}




function hablar(texto) {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";
    window.speechSynthesis.speak(msg);
    }
}
