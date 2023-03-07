import { DEFAULT_NAME } from '../common/constants';
import { stateGame } from '../types/types';
import { Sounds } from './audio';
import { Auth } from './authentication';
import { Color } from './color';
import { Translate } from './translation';
import { checkedQuerySelector } from './utils';

export class State {
    static settings = {
        screen: 'LAUNCH',
        players: '4',
        sound: 'ON',
        color: 'SAND',
        language: 'EN',
        statusAuth: 'LOGIN/SIGNUP',
        username: DEFAULT_NAME,
    };

    static game: stateGame = {
        players: [],
    };

    static setSettings() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        const option = item.querySelector('.menu__switcher_selected');

        if (option) {
            switch (true) {
                case item.classList.contains('menu__item_players'):
                    State.settings.players = option.id;
                    Auth.updateState();
                    break;
                case item.classList.contains('menu__item_sound'):
                    State.settings.sound = option.id;
                    Sounds.playIntro();
                    Auth.updateState();
                    break;
                case item.classList.contains('menu__item_color'):
                    State.settings.color = option.id;
                    Color.setConsoleColor();
                    Auth.updateState();
                    break;
                case item.classList.contains('menu__item_language'):
                    State.settings.language = option.id;
                    Translate.setMenuLang();
                    Auth.updateState();
                    break;
                default:
                    break;
            }
        }
    }

    // set menu switchers based on settings state

    static setMenuItems() {
        const options = document.querySelectorAll('.menu__switcher');

        for (const option of options) {
            for (const item of Object.values(State.settings)) {
                if (option.id === item) {
                    option.classList.add('menu__switcher_selected');
                }
            }
        }
    }
}
