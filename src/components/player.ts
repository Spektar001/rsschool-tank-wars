import {
    CANVAS_BORDER_OFFSET,
    CANVAS_WIDTH,
    GRAVITY,
    INITIAL_ANGLE_LEFT,
    INITIAL_ANGLE_RIGHT,
    LENGTH_GUN,
    MAX_ANGLE,
    MAX_POWER,
    MIN_ANGLE,
    MIN_POWER,
    POWER_GUN,
    POWER_RATIO,
    PROJECTILE_COLOR,
    TANK_HITBOX_BOTTOM,
    TANK_HITBOX_LEFT,
    TANK_HITBOX_RIGHT,
    TANK_HITBOX_TOP,
    TRAJECTORY_COLOR,
} from '../common/constants';
import { Field } from './field';
import { Tank } from './tank';
import { Ui } from './ui';
import { calcAngle, checkedQuerySelector, drawCanvasArc, getRandomWind, isGround, isOutsidePlayZone } from './utils';
import { explTank } from './explosion';
import { explShell } from './explosion-shell';
import { Sounds } from './audio';
import { Translate } from './translation';
import { State } from './state';
import { Sound } from '../types/types';

export class Player {
    name: string;
    angle: number;
    power = POWER_GUN;
    projectileTrajectory: { x: number; y: number }[] = [];
    currentTrajectoryIndex = 0;
    intervalId = 0;
    isFired = false;
    isHitted = false;
    positionX: number;
    positionY: number;
    wind = getRandomWind();
    tank: Tank;
    ui: Ui;
    static tick = 0;
    static explosionX = 0;
    static explosionY = 0;
    static animationExplosionTankFlag = false;
    static animationExplosionShellFlag = false;
    static animationFlag = false;
    static ctx: CanvasRenderingContext2D;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private field: Field,
        public initialTankPositionX: number,
        public initialTankPositionY: number,
        public nameStr: string,
        public colorTank: string
    ) {
        this.name = nameStr;
        this.angle = initialTankPositionX > CANVAS_WIDTH / 2 ? INITIAL_ANGLE_RIGHT : INITIAL_ANGLE_LEFT;
        State.game.players.push(this);
        this.positionX = initialTankPositionX;
        this.positionY = initialTankPositionY;
        this.tank = new Tank(this.positionX, this.positionY);
        this.ui = new Ui();
    }

    // set current player info on the top of the the game screen

    setPlayerInfo() {
        const angleText = checkedQuerySelector(document, '.angle');
        const powerText = checkedQuerySelector(document, '.power');
        const windText = checkedQuerySelector(document, '.wind');
        const playerText = checkedQuerySelector(document, '.player');
        const playerColor = checkedQuerySelector(document, '.color');
        angleText.innerHTML = Translate.setLang().screen.angle + this.angle + '°';
        powerText.innerHTML = Translate.setLang().screen.power + this.power + '%';
        windText.innerHTML =
            Translate.setLang().screen.wind +
            `${Math.abs(Math.round(this.wind * 100))}${Translate.setLang().screen.windSpeed} ${
                this.wind < 0 ? '<<<' : '>>>'
            }`;
        playerText.innerHTML = Translate.setLang().screen.player + this.name;
        playerColor.style.backgroundColor = this.colorTank;
    }

    angleUp() {
        this.angle < MAX_ANGLE ? this.angle++ : (this.angle = MAX_ANGLE);
        const angleText = checkedQuerySelector(document, '.angle');
        angleText.innerHTML = Translate.setLang().screen.angle + this.angle;
    }

    angleDown() {
        this.angle > MIN_ANGLE ? this.angle-- : (this.angle = MIN_ANGLE);
        const angleText = checkedQuerySelector(document, '.angle');
        angleText.innerHTML = Translate.setLang().screen.angle + this.angle;
    }

    powerUp() {
        this.power < MAX_POWER ? this.power++ : (this.power = MAX_POWER);
        const powerText = checkedQuerySelector(document, '.power');
        powerText.innerHTML = Translate.setLang().screen.power + this.power;
    }

    powerDown() {
        this.power > MIN_POWER ? this.power-- : (this.power = MIN_POWER);
        const powerText = checkedQuerySelector(document, '.power');
        powerText.innerHTML = Translate.setLang().screen.power + this.power;
    }

    private calcXCoords() {
        return this.initialTankPositionX + 13 + Math.cos(calcAngle(this.angle)) * LENGTH_GUN;
    }

    private calcYCoords() {
        return this.initialTankPositionY - 6 + Math.sin(calcAngle(this.angle)) * LENGTH_GUN;
    }

    // calculate projectile trajectory

    private calculateTrajectory(players: Player[]) {
        this.projectileTrajectory = [];
        let xCoordinate = 0;
        let yCoordinate = 0;
        let time = 0;

        do {
            xCoordinate =
                this.wind * time +
                this.calcXCoords() +
                (this.power / POWER_RATIO) * Math.cos((this.angle / 180) * Math.PI) * time;

            yCoordinate =
                this.calcYCoords() -
                ((this.power / POWER_RATIO) * Math.sin((this.angle / 180) * Math.PI) * time +
                    0.5 * GRAVITY * Math.pow(time, 2));

            this.projectileTrajectory.push({ x: xCoordinate, y: yCoordinate });
            time++;
        } while (
            xCoordinate >= -CANVAS_BORDER_OFFSET &&
            xCoordinate <= CANVAS_WIDTH + CANVAS_BORDER_OFFSET &&
            !this.isTerrainHit() &&
            !this.isTargetHit(players)?.isHitted
        );
    }

    private shoot() {
        this.currentTrajectoryIndex = 0;
        this.intervalId = window.setInterval(this.nextProjectilePosition.bind(this), 10);
        if (this.power === 0) {
            clearInterval(this.intervalId);
            this.isFired = false;
        } else {
            this.isFired = true;
        }
    }

    private nextProjectilePosition() {
        this.currentTrajectoryIndex++;
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1) {
            this.endShot();
        }
    }

    private endShot() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.isFired = false;
            this.wind = getRandomWind();
            this.setPlayerInfo();
        }
    }

    // check is projectile hit the ground

    isTerrainHit() {
        const canvas = this.field.canvas;
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
            const pixel = ctx.getImageData(this.projectileTrajectory[i].x, this.projectileTrajectory[i].y, 1, 1);
            if (isGround(pixel)) {
                return true;
            }
        }
    }

    // check is projectile hit left or right border of the game screen

    isScreenHit() {
        for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
            if (isOutsidePlayZone(this.projectileTrajectory[i].x)) {
                return true;
            }
        }
    }

    // check is projectile hit any of tanks (including players tank)

    isTargetHit(players: Player[]) {
        for (const player of players) {
            for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
                if (
                    this.projectileTrajectory[i].x > player.initialTankPositionX - TANK_HITBOX_LEFT &&
                    this.projectileTrajectory[i].x < player.initialTankPositionX + TANK_HITBOX_RIGHT &&
                    this.projectileTrajectory[i].y > player.initialTankPositionY - TANK_HITBOX_TOP &&
                    this.projectileTrajectory[i].y < player.initialTankPositionY + TANK_HITBOX_BOTTOM
                ) {
                    players.map((item) => {
                        if (item.initialTankPositionX === player.initialTankPositionX) {
                            item.isHitted = true;
                        }
                    });

                    return player;
                }
            }
        }
    }

    fireProjectile(players: Player[]) {
        this.calculateTrajectory(players);
        this.shoot();
    }

    // render players tank

    drawPlayer() {
        this.tank.initialTankPositionX = this.positionX;
        this.tank.initialTankPositionY = this.positionY;
        this.tank.drawTankGun(this.calcXCoords(), this.calcYCoords());
        this.tank.drawBodyTank(this.colorTank);
    }

    clearPlayers() {
        this.tank.clearTanks();
    }

    drawTerrainHit() {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1 && this.isTerrainHit()) {
            Player.explosionX = this.projectileTrajectory[this.currentTrajectoryIndex].x;
            Player.explosionY = this.projectileTrajectory[this.currentTrajectoryIndex].y;
            Player.animationExplosionShellFlag = true;
            Player.ctx = this.ctx;
            Sounds.play(Sound.terrainExplosion, 0.3);
        }
    }

    drawHit(players: Player[]) {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1 && this.isTargetHit(players)) {
            Player.animationExplosionTankFlag = true;
            Player.ctx = this.ctx;
            Sounds.play(Sound.tankExplosion);

            for (const player of players) {
                if (player.isHitted) {
                    Player.explosionX = player.positionX;
                    Player.explosionY = player.positionY;
                    players.splice(players.indexOf(player), 1);
                    this.projectileTrajectory = [];
                    this.updatePlayers();
                }
            }
        }
    }

    // render projectile based on calculated trajectory

    drawPlayerProjectile() {
        this.ctx.fillStyle = PROJECTILE_COLOR;
        if (this.currentTrajectoryIndex && this.projectileTrajectory[this.currentTrajectoryIndex] !== undefined) {
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.currentTrajectoryIndex].x,
                this.projectileTrajectory[this.currentTrajectoryIndex].y,
                3
            );
        }
    }

    // render projectile path based on calculated trajectory

    drawProjectilePath() {
        this.ctx.fillStyle = TRAJECTORY_COLOR;
        if (this.currentTrajectoryIndex) {
            for (let i = 0; i < this.currentTrajectoryIndex; i++) {
                if (this.projectileTrajectory[i] !== undefined) {
                    drawCanvasArc(this.ctx, this.projectileTrajectory[i].x, this.projectileTrajectory[i].y, 1);
                }
            }
        }
    }

    drawFire() {
        this.drawPlayerProjectile();
        this.drawProjectilePath();
        this.drawHit(State.game.players);
        this.drawTerrainHit();
    }

    static drawExplosionTank() {
        const tickFrame = Math.floor(Player.tick / explTank.speed);
        Player.animationFlag = true;
        Player.animationExplosionShellFlag = false;
        Player.ctx.drawImage(
            explTank.img,
            explTank.frame[tickFrame][0],
            explTank.frame[tickFrame][1],
            explTank.width,
            explTank.height,
            Player.explosionX - 20,
            Player.explosionY - 70,
            66,
            81
        );
        Player.tick++;
        if (Math.floor(this.tick / 10) === 24) {
            this.tick = 0;
            Player.animationExplosionTankFlag = false;
            Player.animationFlag = false;
        }
    }

    static drawExplosionShell() {
        const tickFrame = Math.floor(Player.tick / explShell.speed);
        Player.animationFlag = true;
        Player.ctx.drawImage(
            explShell.img,
            explShell.frame[tickFrame][0],
            explShell.frame[tickFrame][1],
            explShell.width,
            explShell.height,
            Player.explosionX - 15,
            Player.explosionY - 22,
            30,
            30
        );
        Player.tick++;
        if (Math.floor(this.tick / 10) === explShell.amountFrame) {
            this.tick = 0;
            Player.animationExplosionShellFlag = false;
            Player.animationFlag = false;
        }
    }

    updatePlayers() {
        this.clearPlayers();
        for (const player of State.game.players) {
            player.drawPlayer();
        }
        this.updatePlayersUi();
    }

    static updateTanks() {
        State.game.currentPl?.updatePlayers();
    }

    private updatePlayersUi() {
        this.ui.renderTanksName(State.game.players);
    }
}
