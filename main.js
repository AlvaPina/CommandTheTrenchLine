// Seleccionamos el cuerpo de la página para cambiar el fondo
const body = document.getElementById('page-body');

// Configura diferentes fondos para cada sección
const sectionImages = {
    'home': 'url(Assets/Images/WebPage/Fondo1.jpg)',
    'game-description': 'url(Assets/Images/WebPage/Fondo2.jpg)',
    'how-to-play': 'url(Assets/Images/WebPage/Fondo3.jpg)',
    'about-us': 'url(Assets/Images/WebPage/Fondo4.png)'
};

// Función que cambia el fondo dependiendo de la sección activa
function changeBackground(sectionId) {
    if (sectionImages[sectionId]) {
        body.style.backgroundImage = sectionImages[sectionId]; // Aplicar la imagen de fondo
        body.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Superposición oscura
        body.style.backgroundBlendMode = 'darken'; // Mezclar la superposición con la imagen
        body.style.backgroundSize = 'cover';
        body.style.transition = 'background-image 0.5s ease'; // Aplicar transición a la imagen de fondo
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

// Seleccionar el botón Home y la sección del juego
const homeLink = document.getElementById('home-link');
const gameFrame = document.querySelector('.game-frame');

// Escuchar el evento de clic en el enlace de Home
homeLink.addEventListener('click', (event) => {
    event.preventDefault(); // Evitar el comportamiento de anclaje predeterminado

    // Calcular la posición centrada del juego
    const frameRect = gameFrame.getBoundingClientRect();
    const offsetY = window.scrollY + frameRect.top - (window.innerHeight / 2) + (frameRect.height / 2);

    // Hacer scroll suave hacia la posición calculada
    window.scrollTo({
        top: offsetY,
        behavior: 'smooth'
    });
});