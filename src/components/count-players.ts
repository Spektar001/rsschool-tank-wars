import { checkedQuerySelector, getRandomColor, getRandomInt, getRandomName } from './utils';
import { Player } from './player';
import { Field } from './field';
import { State } from './state';

export class Count {
    static getPlayers() {
        const canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_animation');
        const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
        const field = new Field();

        switch (+State.settings.players) {
            case 2:
                new Player(ctx, field, 35, 0, getRandomName(), getRandomColor());
                new Player(ctx, field, 745, 0, getRandomName(), getRandomColor());
                break;
            case 3:
                new Player(ctx, field, 35, 0, getRandomName(), getRandomColor());
                new Player(ctx, field, 385, 0, getRandomName(), getRandomColor());
                new Player(ctx, field, 745, 0, getRandomName(), getRandomColor());
                break;
            case 4:
                new Player(ctx, field, 35, 0, getRandomName(), getRandomColor());
                new Player(ctx, field, 265, 0, getRandomName(), getRandomColor());
                new Player(ctx, field, 505, 0, getRandomName(), getRandomColor());
                new Player(ctx, field, 745, 0, getRandomName(), getRandomColor());
                break;
        }
        State.game.currentPl = State.game.players[getRandomInt(0, +State.settings.players - 1)];
    }
}
