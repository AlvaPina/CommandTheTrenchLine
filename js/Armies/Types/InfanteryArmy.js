import Army from "../Army.js";

export default class InfanteryArmy extends Army {

    constructor(scene, x, team) {
        const config = {
            ArmyHealth: 200,
            NumberOfSoldiers: 20,
            ArmySpeed: 50,
            ArmyTeam: team,
            ArmyAnimKey: 'infanterySoldier'
        };
        super(scene, x, config);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}
