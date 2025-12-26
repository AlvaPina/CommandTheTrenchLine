import Army from "../Army.js";

const BASE_CONFIG = {
  SoldierHealth: 100,
  NumberOfSoldiers: 4,
  ArmySpeed: 45,
  DistanceView: 400,
  ArmyDamage: 2,
  ArmyAnimKey: 'infanterySoldier',
  ImageKey: 'sniperSoldier',
  DisplayName: 'Sniper'
};

export default class SniperArmy extends Army {
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
