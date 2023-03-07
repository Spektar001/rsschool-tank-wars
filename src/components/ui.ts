import { checkedQuerySelector } from './utils';
import { Player } from './player';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../common/constants';

export class Ui {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_ui');
    ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d', { willReadFrequently: true });
    constructor() {
        this.ctx.font = '9px PressStart2P';
        this.ctx.fillStyle = '#FFFFFF';
    }

    renderTanksName(players: Player[]) {
        this.clearUi();
        for (const player of players) {
            this.renderTankName(player);
        }
    }

    private clearUi() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    private renderTankName(player: Player) {
        const biasName = 12 - (player.name.length * 9) / 2;
        this.ctx.fillText(player.name, player.positionX + biasName, player.positionY - 40);
    }
}
