import MovementComponent from './Movement/MovementComponent.js';

export default class TankHumanoid extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, army) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);

    this.army = army;

    const config = this.army.getConfig();
    this.speed = config.speed;
    this.team = config.team;

    this.state = 'Moving';
    this.lastorder = 'Moving';

    this.movementComponent = new MovementComponent(this, this.speed);

    // Sounds (copiado)
    this.shootKeys = ['gunRifleShoot1', 'gunRifleShoot2', 'gunRifleShoot3', 'gunRifleShoot4', 'gunRifleShoot5'];
    this.shootVolume = 0.2;
    this.attackPauseMinMs = 500;
    this.attackPauseMaxMs = 2000;

    // Tank
    this.isHatchOpen = false;
    this._isOpening = false;
    this._isClosing = false;
    this._tankSoundTimer = null;

    const suffix = this.team ? 'Green' : 'Grey';
    this.tankAnimMove = `lightTank${suffix}Moving`;
    this.tankAnimShoot = `lightTank${suffix}Attacking`;
    this.tankAnimOpen = `lightTank${suffix}Open`;
    this.tankAnimDead = `lightTank${suffix}Dying`;
    this.tankAnimDeadLoop = `lightTank${suffix}DeadLoop`;

    // arrancar visual
    this.play(this.tankAnimMove, true);
  }

  // --- orientación ---
  _soldierOrientationAux(direction) {
    if (direction == 1) {
      this.setFlipX(false);
      this.setOrigin(this.originRight, 0.5);
    } else if (direction == -1) {
      this.setFlipX(true);
      this.setOrigin(this.originLeft, 0.5);
    }
  }

  _movingOrientation() {
    this._soldierOrientationAux(this.movementComponent.getDirectionX());
  }

  _faceEnemyBase() {
    this._soldierOrientationAux(this.movementComponent.soldierOrientation("EnemyBase", this.team));
  }

  // --- shooting loop ---
  _playRandomShoot() {
    const idx = Phaser.Math.Between(0, this.shootKeys.length - 1);
    const key = this.shootKeys[idx];
    this.scene.sound.play(key, { volume: this.shootVolume });
  }

  _stopTankShootingLoop() {
    if (this._tankSoundTimer) {
      this._tankSoundTimer.remove(false);
      this._tankSoundTimer = null;
    }
  }

  _startTankShootingLoop() {
    if (this._tankSoundTimer) return;

    const scheduleNext = () => {
      if (this.state === 'Dying') return;
      if (this.lastorder !== 'Attacking') return;
      if (!this.isHatchOpen) return;

      this._playRandomShoot();

      const pauseMs = Phaser.Math.Between(this.attackPauseMinMs, this.attackPauseMaxMs);
      this._tankSoundTimer = this.scene.time.delayedCall(pauseMs, () => {
        this._tankSoundTimer = null;
        scheduleNext();
      });
    };

    scheduleNext();
  }

  // --- estados tapa ---
  _startOpeningThenAttack() {
    this._isOpening = true;
    this._isClosing = false;

    this.state = 'Opening';
    this.play(this.tankAnimOpen, true);
    this._faceEnemyBase();

    this.once('animationcomplete', (anim) => {
      if (anim.key !== this.tankAnimOpen) return;
      this.isHatchOpen = true;
      this._isOpening = false;

      // empieza ataque real
      this.state = 'Attacking';
      this.play(this.tankAnimShoot, true);
      this._faceEnemyBase();
      this._startTankShootingLoop();
    });
  }

  _startClosingThenContinue(nextState, params) {
    this._isClosing = true;
    this._isOpening = false;

    this.state = 'Closing';

    // Cerrar = anim al revés
    this.anims.playReverse(this.tankAnimOpen);
    this._faceEnemyBase();

    this.once('animationcomplete', (anim) => {
      if (anim.key !== this.tankAnimOpen) return;
      this.isHatchOpen = false;
      this._isClosing = false;

      // continuar orden pendiente
      this.setOrder(nextState, params);
    });
  }

  // --- API igual que Humanoid ---
  moveTo(targetX, targetY) {
    if (this.state === 'Dying') return;
    this.setOrder('Moving', [targetX, targetY]);
  }

  die() {
    if (this.state === 'Dying') return;
    if (this.timerOrder) {
      this.timerOrder.remove(false);
      this.timerOrder = null;
    }
    this.state = 'Dying';
    this.lastorder = 'Dying';
    this._stopTankShootingLoop();

    this.play(this.tankAnimDead, true);

    this.once('animationcomplete', (anim) => {
      if (anim.key === this.tankAnimDead) {
        this.play(this.tankAnimDeadLoop, true);
      }
    });
  }

  setOrder(newState, params) {
    if (this.state === 'Dying') return;

    // bloqueo duro mientras abre/cierra
    if (this._isOpening || this._isClosing) {
      this.lastorder = newState;
      this._pendingParams = params;
      return;
    }
    if (this.timerOrder) {
        this.timerOrder.remove(false);
        this.timerOrder = null;
    }

    this.lastorder = newState;

    // retraso random como Humanoid (para que se comporte parecido)
    const randomDelay = Phaser.Math.Between(100, 800);

    this.timerOrder = this.scene.time.delayedCall(randomDelay, () => {
      this.timerOrder = null;
      if (this.state === 'Dying') return;
      if (this.lastorder !== newState) return;

      // si nos piden atacar y tapa cerrada -> abrir primero
      if (newState === 'Attacking' && !this.isHatchOpen) {
        this._startOpeningThenAttack();
        return;
      }

      // si dejamos de atacar y tapa abierta -> cerrar primero
      if (newState !== 'Attacking' && this.isHatchOpen) {
        this._stopTankShootingLoop();
        this._startClosingThenContinue(newState, params);
        return;
      }

      // Estado normal
      this.state = newState;

      if (params && newState === 'Moving') {
        this.movementComponent.moveTo(params[0], params[1]);
        this._movingOrientation();
      }

      if (newState === 'Moving') {
        this.play(this.tankAnimMove, true);
        this._stopTankShootingLoop();
      } else if (newState === 'Idle') {
        this.play(this.tankAnimMove, true); // idle = move loop (como dijiste)
        this._faceEnemyBase();
        this._stopTankShootingLoop();
      } else if (newState === 'Attacking') {
        // aquí solo entra si ya está abierta
        this.play(this.tankAnimShoot, true);
        this._faceEnemyBase();
        this._startTankShootingLoop();
      }
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // bloqueo durante Opening/Closing (solo dejamos anim avanzar)
    if (this._isOpening || this._isClosing) return;

    // movimiento
    if (this.state === 'Moving') {
      this.movementComponent.movement();
      if (!this.movementComponent.targetPosition) {
        this.state = 'Idle';
        this._faceEnemyBase();
        this.play(this.tankAnimMove, true);
      }
    }

    // si por seguridad ya no estamos atacando, paramos sonidos
    if (this.lastorder !== 'Attacking') {
      this._stopTankShootingLoop();
    }
  }
}
