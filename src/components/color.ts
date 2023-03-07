import { ButtonsColors, CircleColors, ConsoleColors } from '../types/types';
import { State } from './state';
import { checkedQuerySelector } from './utils';

export class Color {
    static setConsoleColor() {
        switch (true) {
            case State.settings.color === 'SAND':
                Color.setColors(ConsoleColors.sand, CircleColors.sand, ButtonsColors.sand);
                break;
            case State.settings.color === 'BLUE':
                Color.setColors(ConsoleColors.blue, CircleColors.blue, ButtonsColors.blue);
                break;
            case State.settings.color === 'BLACK':
                Color.setColors(ConsoleColors.black, CircleColors.black, ButtonsColors.black);
                break;
            default:
                break;
        }
    }

    static setColors(consoleColor: string, circleSelector: string, buttonsSelector: string) {
        const gameConsole = checkedQuerySelector(document, '.game__console');
        const gameConsoleCircles = document.querySelectorAll('.game__controls_circle');
        const gameConsoleButtons = checkedQuerySelector(document, '.cross__options_buttons');
        const enumConsoleColors = Object.values(ConsoleColors);
        const enumCircleColors = Object.values(CircleColors);
        const enumButtonsColors = Object.values(ButtonsColors);

        for (const selector of enumConsoleColors) {
            gameConsole.classList.remove(selector);
        }

        for (const selector of enumCircleColors) {
            for (const item of gameConsoleCircles) {
                item.classList.remove(selector);
            }
        }

        for (const selector of enumButtonsColors) {
            gameConsoleButtons.classList.remove(selector);
        }

        gameConsole.classList.add(consoleColor);
        for (const item of gameConsoleCircles) {
            item.classList.add(circleSelector);
        }
        gameConsoleButtons.classList.add(buttonsSelector);
    }
}
