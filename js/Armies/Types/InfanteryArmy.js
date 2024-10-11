import Army from "../Army.js";

export default class InfanteryArmy extends Army {

    constructor(scene, x, y) {
        super(scene, x, y);
    }

    // CONFIGURACION DEL EJERCITO
    static getConfig() {
        return {
            ArmyHealth: 200,
            NumberOfSoldiers: 20,
            ArmySpeed: 80,
            ArmyAnimKey: 'infanterySoldier'
        };
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}
