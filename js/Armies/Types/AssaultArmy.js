import Army from "../Army.js";

export default class AssaultArmy extends Army {

    constructor(scene, x, armyNumber, team) {
        if (typeof team !== 'boolean') {
            throw new TypeError("El parametro 'team' no es un booleano");
        }
        const config = {
            ArmyNumber : armyNumber,
            SoldierHealth: 150,
            NumberOfSoldiers: 10,
            ArmySpeed: 65,
            DistanceView : 200,
            ArmyTeam: team,
            ArmyAnimKey: 'infanterySoldier',
            ImageKey : 'assaultSoldier'
        };
        super(scene, x, config);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}
