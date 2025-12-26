import Army from "../Army.js";

const BASE_CONFIG = {
  SoldierHealth: 150,
  NumberOfSoldiers: 10,
  ArmySpeed: 65,
  DistanceView: 200,
  ArmyDamage: 1.25,
  ArmyAnimKey: 'infanterySoldier',
  ImageKey: 'assaultSoldier',
  DisplayName: 'Assault'
};

export default class AssaultArmy extends Army {
  static getBaseConfig() { return { ...BASE_CONFIG }; }

  constructor(scene, x, armyNumber, team) {
    if (typeof team !== 'boolean') throw new TypeError("El parametro 'team' no es un booleano");

    const config = { ...BASE_CONFIG, ArmyNumber: armyNumber, ArmyTeam: team };
    super(scene, x, config);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }
}
