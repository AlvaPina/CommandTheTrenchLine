import Army from "../Army.js";
import TankHumanoid from "../TankHumanoid.js";

const BASE_CONFIG = {
  SoldierHealth: 800,
  NumberOfSoldiers: 4,
  ArmySpeed: 30,
  DistanceView: 190,
  ArmyDamage: 1.5,

  ImageKey: 'tankSoldier',
  ArmyAnimKey: 'tankSoldier',
  DisplayName: 'Tank',
  HumanoidClass: TankHumanoid,
};

export default class TankArmy extends Army {
  static getBaseConfig() { return { ...BASE_CONFIG }; }

  constructor(scene, x, armyNumber, team) {
    if (typeof team !== 'boolean') {
      throw new TypeError("El parametro 'team' no es un booleano");
    }

    const config = { ...BASE_CONFIG, ArmyNumber: armyNumber, ArmyTeam: team };
    super(scene, x, config);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }
}
