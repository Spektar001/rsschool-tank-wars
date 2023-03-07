import { CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_GROUND, CANVAS_FLY } from '../common/constants';
import { checkedQuerySelector, getRandomInt } from './utils';
import { mapsArr } from './maps/map';
import { Player } from './player';

export class Field {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_background');
    context = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    constructor() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
    }

    private clear() {
        this.context.fillStyle = CANVAS_FLY;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private repainting(img: ImageData, colorFly: string, colorGround: string) {
        for (let i = 0; i < img.data.length; i += 4) {
            if (img.data[i] === 255) {
                img.data[i] = parseInt(colorFly[1] + colorFly[2], 16);
                img.data[i + 1] = parseInt(colorFly[3] + colorFly[4], 16);
                img.data[i + 2] = parseInt(colorFly[5] + colorFly[6], 16);
            } else if (img.data[i] === 0) {
                img.data[i] = parseInt(colorGround[1] + colorGround[2], 16);
                img.data[i + 1] = parseInt(colorGround[3] + colorGround[4], 16);
                img.data[i + 2] = parseInt(colorGround[5] + colorGround[6], 16);
            }
        }
    }

    private loadMap() {
        this.context.drawImage(mapsArr[getRandomInt(0, mapsArr.length - 1)], 0, 0);
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.repainting(imageData, CANVAS_FLY, CANVAS_GROUND);
        this.context.putImageData(imageData, 0, 0);
    }

    generate(callback: (arg: Player[], field: Field) => void, arg: Player[], field: Field) {
        this.clear();
        this.loadMap();
        callback(arg, field);
    }

    findGround(x: number): number {
        const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        for (let i = x * 4; i < imgData.length; i += CANVAS_WIDTH * 4) {
            if (
                imgData[i] === parseInt(CANVAS_GROUND[1] + CANVAS_GROUND[2], 16) &&
                imgData[i + 1] === parseInt(CANVAS_GROUND[3] + CANVAS_GROUND[4], 16) &&
                imgData[i + 2] === parseInt(CANVAS_GROUND[5] + CANVAS_GROUND[6], 16)
            ) {
                return Math.floor(i / (CANVAS_WIDTH * 4));
            }
        }
        return CANVAS_HEIGHT as number;
    }
}
