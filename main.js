// Seleccionamos el cuerpo de la página para cambiar el fondo
const body = document.getElementById('page-body');

// Configura diferentes fondos para cada sección
const sectionBackgrounds = {
    'home': 'url(Assets/Images/WebPage/Fondo1.jpg)',
    'game-description': 'url(Assets/Images/WebPage/Fondo2.jpg)',
    'how-to-play': 'url(Assets/Images/WebPage/Fondo3.jpg)',
    'about-us': 'url(Assets/Images/WebPage/Fondo4.png)'
};

// Función para cambiar el fondo
function changeBackground(sectionId) {
    if (sectionBackgrounds[sectionId]) {
        body.style.backgroundImage = sectionBackgrounds[sectionId];
        body.style.backgroundSize = 'cover';
        body.style.transition = 'background 0.5s ease';
    }
}

// Función que determina la sección más cercana a la parte superior de la pantalla
function getClosestSection() {
    let closestSection = null;
    let minDistance = Infinity;
    
    // Obtenemos todas las secciones
    const sections = document.querySelectorAll('section, main');
    
    // Iteramos sobre cada sección
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        
        // Calculamos la distancia de la sección desde la parte superior de la ventana
        const distance = Math.abs(rect.top);
        
        // Si la sección está más cerca de la parte superior de la pantalla, la seleccionamos
        if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
        }
    });
    
    // Devolvemos la ID de la sección más cercana
    return closestSection ? closestSection.id : null;
}

// Evento de desplazamiento
window.addEventListener('scroll', () => {
    const sectionId = getClosestSection();
    if (sectionId) {
        changeBackground(sectionId);
    }
});

// Cambio inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const sectionId = getClosestSection();
    if (sectionId) {
        changeBackground(sectionId);
    }
});
