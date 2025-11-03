import Army from "../Army.js";

export default class InfanteryArmy extends Army {

    constructor(scene, x, armyNumber, team) {
        if (typeof team !== 'boolean') {
            throw new TypeError("El parametro 'team' no es un booleano");
        }
        const config = {
            ArmyNumber : armyNumber,
            SoldierHealth: 100,
            NumberOfSoldiers: 12,
            ArmySpeed: 50,
            DistanceView : 200,
            ArmyTeam: team,
            ArmyAnimKey: 'infanterySoldier'
        };
        super(scene, x, config);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}
