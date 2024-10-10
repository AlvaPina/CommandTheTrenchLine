import Humanoid from "../Humanoid.js";

export default class Infantery extends Humanoid {
    
    // Definir la configuración como constante estática
    static infantryConfig = {
        ArmyHealth: 200,
        numberOfSoldiers: 20,
        speed: 70
    };

    constructor(scene, x, y) {
        super(scene, x, y);
    }

    // Devuelve la configuración
    static getConfig() {
        return this.infanteryConfig;
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}
