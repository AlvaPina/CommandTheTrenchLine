import InfanteryArmy from '../Armies/Types/InfanteryArmy.js';
import SniperArmy from '../Armies/Types/SniperArmy.js';
import AssaultArmy from '../Armies/Types/AssaultArmy.js';

export const TROOP_CLASS_BY_BUTTON = {
  InfanterySoldierButton: InfanteryArmy,
  SniperSoldierButton: SniperArmy,
  AssaultSoldierButton: AssaultArmy,
};

export function getTroopStatsFromButtonKey(buttonKey) {
  const Cls = TROOP_CLASS_BY_BUTTON[buttonKey];
  if (!Cls || !Cls.getBaseConfig) return null;
  return Cls.getBaseConfig();
}
