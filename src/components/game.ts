import { checkedQuerySelector } from './utils';
import { Field } from './field';
import { Player } from './player';
import { Page } from './pages';
import { Count } from './count-players';
import { State } from './state';
import { Timer } from './timer';

export class Game {
    field = new Field();

    private static clean() {
        const canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_animation');
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, 800, 600);
    }

    start() {
        Count.getPlayers();
        Game.clean();
        this.field.generate(this.setPositionTank, State.game.players, this.field); //drawing ground and sky and setTank
        State.game.currentPl?.setPlayerInfo();
        Timer.startTimer();
    }

    private static end() {
        if (State.game.players.length === 1) {
            Timer.stopTimer();
            Timer.resetTime();
            Page.renderWinner(State.game.players[0]);
            State.game.players = [];
        }
    }

    static updateAnimation() {
        Game.clean();
        State.game.currentPl?.drawFire();
        Game.checkHit();

        if (Player.animationExplosionTankFlag) {
            Player.drawExplosionTank();
        } else {
            if (Player.animationExplosionShellFlag) {
                Player.drawExplosionShell();
            }
        }

        if (Player.animationFlag) {
            window.requestAnimationFrame(Game.updateAnimation.bind(this));
        } else {
            Game.clean();
            Game.end();
        }
    }

    private static checkHit() {
        if (State.game.currentPl) {
            const i = State.game.players.indexOf(State.game.currentPl);

            if (
                (State.game.currentPl.isTerrainHit() ||
                    State.game.currentPl.isScreenHit() ||
                    State.game.currentPl.isHitted) &&
                !State.game.currentPl.isFired
            ) {
                State.game.currentPl.projectileTrajectory = [];
                State.game.currentPl =
                    State.game.players.length - 1 !== i ? State.game.players[i + 1] : State.game.players[0];
                State.game.currentPl.setPlayerInfo();
                Timer.setTime();
                Player.animationFlag = false;
            }
        }
    }

    // set tank position for y coordinate based on current game field and x position

    private setPositionTank(players: Player[], field: Field) {
        for (const player of players) {
            player.initialTankPositionY = field.findGround(player.initialTankPositionX);
            player.positionY = player.initialTankPositionY;
        }
        players[0].updatePlayers();
    }
}
