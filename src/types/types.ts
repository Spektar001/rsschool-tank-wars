import { Player } from '../components/player';

/* interfaces ------------------------------------------------- */

export interface stateGame {
    players: Player[];
    currentPl?: Player;
}

/* enums ------------------------------------------------- */

export enum Sound {
    intro = 'intro',
    click = 'click',
    move = 'move',
    scroll = 'scroll_gun',
    shot = 'shot_tank',
    tankExplosion = 'bang_tank',
    terrainExplosion = 'damage_po_zemle',
    winner = 'winner',
}

export enum ConsoleColors {
    sand = 'game__console_sand',
    blue = 'game__console_blue',
    black = 'game__console_black',
}

export enum CircleColors {
    sand = 'game__controls_circle_sand',
    blue = 'game__controls_circle_blue',
    black = 'game__controls_circle_black',
}

export enum ButtonsColors {
    sand = 'cross__options_buttons_sand',
    blue = 'cross__options_buttons_blue',
    black = 'cross__options_buttons_black',
}
