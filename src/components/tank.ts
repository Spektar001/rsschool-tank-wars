import { checkedQuerySelector, degToRad } from './utils';
import { CANVAS_HEIGHT, CANVAS_WIDTH, TANK_COLOR } from '../common/constants';

export class Tank {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_tank');
    ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d', { willReadFrequently: true });

    constructor(public initialTankPositionX: number, public initialTankPositionY: number) {}

    drawBodyTank(colorTank: string) {
        // render tank wheels
        const step = 8.5;
        let x = this.initialTankPositionX;
        this.ctx.lineWidth = 2.5;
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(x, this.initialTankPositionY, 1.5, degToRad(0), degToRad(360));
            this.ctx.fillStyle = TANK_COLOR;
            this.ctx.fill();
            this.ctx.strokeStyle = TANK_COLOR;
            this.ctx.stroke();
            x += step;
        }

        // render tank hull
        this.ctx.beginPath();
        this.ctx.moveTo(this.initialTankPositionX - 7, this.initialTankPositionY);
        this.ctx.lineTo(this.initialTankPositionX - 3, this.initialTankPositionY - 5);
        this.ctx.lineTo(this.initialTankPositionX + 29, this.initialTankPositionY - 5);
        this.ctx.lineTo(this.initialTankPositionX + 33, this.initialTankPositionY);
        this.ctx.strokeStyle = TANK_COLOR;
        this.ctx.stroke();

        // render tank tower
        this.ctx.beginPath();
        this.ctx.arc(this.initialTankPositionX + 13, this.initialTankPositionY - 6, 9, degToRad(180), degToRad(0));
        this.ctx.fillStyle = `${colorTank}`;
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawTankGun(x: number, y: number) {
        // render tank gun
        this.ctx.beginPath();
        this.ctx.moveTo(this.initialTankPositionX + 13, this.initialTankPositionY - 6);
        this.ctx.lineTo(x, y);
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = TANK_COLOR;
        this.ctx.stroke();
    }

    clearTanks() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}
