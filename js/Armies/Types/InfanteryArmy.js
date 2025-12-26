import Army from "../Army.js";

const BASE_CONFIG = {
  SoldierHealth: 100,
  NumberOfSoldiers: 15,
  ArmySpeed: 50,
  DistanceView: 300,
  ArmyDamage: 1,
  ArmyAnimKey: 'infanterySoldier',
  ImageKey: 'infanterySoldier',
  DisplayName: 'Infantry'
};

export default class InfanteryArmy extends Army {
  static getBaseConfig() {
    return { ...BASE_CONFIG }; // devolvemos copia para no modificar accidentalmente
  }

  constructor(scene, x, armyNumber, team) {
    if (typeof team !== 'boolean') throw new TypeError("El parametro 'team' no es un booleano");

    const config = {
      ...BASE_CONFIG,
      ArmyNumber: armyNumber,
      ArmyTeam: team
    };
    super(scene, x, config);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }
}
