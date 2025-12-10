import Army from "../Army.js";

export default class InfanteryArmy extends Army {

    constructor(scene, x, armyNumber, team) {
        if (typeof team !== 'boolean') {
            throw new TypeError("El parametro 'team' no es un booleano");
        }
        const config = {
            ArmyNumber : armyNumber,
            SoldierHealth: 100,
            NumberOfSoldiers: 4,
            ArmySpeed: 45,
            DistanceView : 400,
            ArmyTeam: team,
            ArmyAnimKey: 'infanterySoldier',
            ImageKey : 'sniperSoldier'
        };
        super(scene, x, config);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}
