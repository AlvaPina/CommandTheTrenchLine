// utils.js

// Genera un número entero aleatorio entre dos valores (inclusive)
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Esperamos ese tiempo (solo se puede usar en funciones async)
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}