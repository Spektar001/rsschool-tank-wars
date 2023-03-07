import { checkedQuerySelector, checkElClass, toggleElClass } from './utils';
import { Page } from './pages';
import { State } from './state';
import { Sounds } from './audio';
import { Timer } from './timer';
import { Player } from './player';
import { Game } from './game';
import { Sound } from '../types/types';
import { RenderAuthPopup } from './auth-popup';
import { Auth } from './authentication';

export class Controls {
    private static addMenuKeys = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowUp':
                event.preventDefault();
                State.settings.screen === 'GAME' ? this.gameUp() : this.menuUp();
                break;
            case 'ArrowDown':
                event.preventDefault();
                State.settings.screen === 'GAME' ? this.gameDown() : this.menuDown();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                State.settings.screen === 'GAME' ? this.gameLeft() : this.menuLeft();
                break;
            case 'ArrowRight':
                event.preventDefault();
                State.settings.screen === 'GAME' ? this.gameRight() : this.menuRight();
                break;
            case 'Pause':
                event.preventDefault();
                if (State.settings.screen === 'GAME') {
                    if (!Player.animationFlag) {
                        checkElClass('game__menu_container', 'game__menu_hidden')
                            ? Timer.switchTimer()
                            : toggleElClass('game__menu_container', 'game__menu_hidden');
                    }
                }
                if (State.settings.screen === 'HOME') {
                    Page.renderGame();
                }
                if (State.settings.screen === 'WINNER') {
                    Page.renderHome();
                }
                Sounds.play(Sound.move);
                break;
            case 'Space':
                event.preventDefault();
                if (State.settings.screen === 'GAME') {
                    checkElClass('game__menu_container', 'game__menu_hidden') ? this.gameFire() : this.menuFire();
                } else {
                    this.menuFire();
                }
                break;
            case 'Escape':
                event.preventDefault();
                if (State.settings.screen === 'GAME') {
                    if (!Player.animationFlag) {
                        Timer.stopTimer();
                        toggleElClass('game__menu_container', 'game__menu_hidden');
                        Sounds.play(Sound.move);
                    }
                } else {
                    Page.renderHome();
                    Sounds.play(Sound.move);
                }
                break;
            default:
                break;
        }
    };

    private static addMenuButtons = (event: Event) => {
        event.preventDefault();
        const target = <HTMLElement>event.target;
        switch (true) {
            case target.classList.contains('cross__arrow_up'):
                State.settings.screen === 'GAME' ? this.gameUp() : this.menuUp();
                break;
            case target.classList.contains('cross__arrow_down'):
                State.settings.screen === 'GAME' ? this.gameDown() : this.menuDown();
                break;
            case target.classList.contains('cross__arrow_left'):
                State.settings.screen === 'GAME' ? this.gameLeft() : this.menuLeft();
                break;
            case target.classList.contains('cross__arrow_right'):
                State.settings.screen === 'GAME' ? this.gameRight() : this.menuRight();
                break;
            case target.classList.contains('options_buttons_pause'):
                if (State.settings.screen === 'GAME') {
                    if (!Player.animationFlag) {
                        checkElClass('game__menu_container', 'game__menu_hidden')
                            ? Timer.switchTimer()
                            : toggleElClass('game__menu_container', 'game__menu_hidden');
                    }
                }
                if (State.settings.screen === 'HOME') {
                    console.log(1);
                    Page.renderGame();
                }
                if (State.settings.screen === 'WINNER') {
                    Page.renderHome();
                }
                if (State.settings.screen === 'LAUNCH') {
                    Page.renderHome();
                }
                Sounds.play(Sound.move);
                break;
            case target.classList.contains('options_buttons_settings'):
                if (State.settings.screen === 'GAME') {
                    if (!Player.animationFlag) {
                        Timer.stopTimer();
                        toggleElClass('game__menu_container', 'game__menu_hidden');
                    }
                } else {
                    Page.renderHome();
                }
                Sounds.play(Sound.move);
                break;
            case target.classList.contains('launch__button'):
                if (State.settings.screen === 'GAME') {
                    checkElClass('game__menu_container', 'game__menu_hidden') ? this.gameFire() : this.menuFire();
                } else {
                    this.menuFire();
                }
                break;
            default:
                break;
        }
    };

    private static menuDown() {
        const items = document.querySelectorAll('.menu__item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('menu__item_selected')) {
                Sounds.play(Sound.click);
                if (i === items.length - 1) {
                    items[i].classList.remove('menu__item_selected');
                    items[0].classList.add('menu__item_selected');
                    return;
                } else {
                    items[i].classList.remove('menu__item_selected');
                    items[i + 1].classList.add('menu__item_selected');
                    return;
                }
            }
        }
    }

    private static gameDown() {
        if (!State.game.currentPl?.isFired) {
            if (State.game.currentPl) State.game.currentPl.projectileTrajectory = [];

            if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                State.game.currentPl?.powerDown();
                State.game.currentPl?.setPlayerInfo();
                if (!Timer.timerIsOn) Timer.startTimer();
                Sounds.play(Sound.scroll);
            } else {
                Controls.menuDown();
            }
        }
    }

    private static menuUp() {
        const items = document.querySelectorAll('.menu__item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('menu__item_selected')) {
                Sounds.play(Sound.click);
                if (i === 0) {
                    items[i].classList.remove('menu__item_selected');
                    items[items.length - 1].classList.add('menu__item_selected');
                    return;
                } else {
                    items[i].classList.remove('menu__item_selected');
                    items[i - 1].classList.add('menu__item_selected');
                    return;
                }
            }
        }
    }

    private static gameUp() {
        if (!State.game.currentPl?.isFired) {
            if (State.game.currentPl) State.game.currentPl.projectileTrajectory = [];

            if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                State.game.currentPl?.powerUp();
                State.game.currentPl?.setPlayerInfo();
                if (!Timer.timerIsOn) Timer.startTimer();
                Sounds.play(Sound.scroll);
            } else {
                Controls.menuUp();
            }
        }
    }

    private static menuLeft() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        const options = item.querySelectorAll('.menu__switcher');
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('menu__switcher_selected')) {
                Sounds.play(Sound.move);
                if (i === 0) {
                    options[i].classList.remove('menu__switcher_selected');
                    options[options.length - 1].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                } else {
                    options[i].classList.remove('menu__switcher_selected');
                    options[i - 1].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                }
            }
        }
    }

    private static gameLeft() {
        if (!State.game.currentPl?.isFired) {
            if (State.game.currentPl) State.game.currentPl.projectileTrajectory = [];

            if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                State.game.currentPl?.angleUp();
                State.game.currentPl?.setPlayerInfo();
                if (!Timer.timerIsOn) Timer.startTimer();
                Player.updateTanks();
                Sounds.play(Sound.scroll);
            } else {
                Controls.menuRight();
                State.game.currentPl?.setPlayerInfo();
                Timer.renderTime();
            }
        }
    }

    private static menuRight() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        const options = item.querySelectorAll('.menu__switcher');
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('menu__switcher_selected')) {
                Sounds.play(Sound.move);
                if (i === options.length - 1) {
                    options[i].classList.remove('menu__switcher_selected');
                    options[0].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                } else {
                    options[i].classList.remove('menu__switcher_selected');
                    options[i + 1].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                }
            }
        }
    }

    private static gameRight() {
        if (!State.game.currentPl?.isFired) {
            if (State.game.currentPl) State.game.currentPl.projectileTrajectory = [];

            if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                State.game.currentPl?.angleDown();
                State.game.currentPl?.setPlayerInfo();
                if (!Timer.timerIsOn) Timer.startTimer();
                Player.updateTanks();
                Sounds.play(Sound.scroll);
            } else {
                Controls.menuLeft();
                State.game.currentPl?.setPlayerInfo();
                Timer.renderTime();
            }
        }
    }

    private static menuFire() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        Sounds.play(Sound.click);
        switch (true) {
            case item.id === 'btn_auth':
                State.settings.statusAuth === 'LOGIN/SIGNUP' ? RenderAuthPopup.showPopup() : Auth.logOut();
                Controls.removeControls();
                break;
            case item.id === 'btn_launch':
                Page.renderHome();
                Sounds.playIntro();
                break;
            case item.id === 'btn_instructions':
                Page.renderInstructions();
                break;
            case item.id === 'btn_start':
                Page.renderGame();
                break;
            case item.id === 'btn_back':
                State.settings.screen === 'GAME'
                    ? toggleElClass('game__menu_container', 'game__menu_hidden')
                    : Page.renderHome();
                break;
            case item.id === 'btn_restart':
                Page.renderHome();
                break;
            case item.id === 'btn_menu':
                State.game.players = [];
                Timer.setTime();
                Page.renderHome();
                break;
            default:
                break;
        }
    }

    private static gameFire() {
        if (!Player.animationFlag) {
            Player.animationFlag = true;
            window.requestAnimationFrame(Game.updateAnimation.bind(this));
            State.game.currentPl?.fireProjectile(State.game.players);
            if (!Timer.timerIsOn) Timer.startTimer();
            Sounds.play(Sound.shot, 0.3);
        }
    }

    static setControls() {
        document.addEventListener('keydown', this.addMenuKeys);
        document.addEventListener('click', this.addMenuButtons);
    }

    static removeControls() {
        document.removeEventListener('keydown', this.addMenuKeys);
        document.removeEventListener('click', this.addMenuButtons);
    }

    private static addInstructionsKeys = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'Enter':
                event.preventDefault();
                this.removeInstructionsControls();
                Sounds.play(Sound.click);
                break;
            case 'Space':
                event.preventDefault();
                this.removeInstructionsControls();
                Sounds.play(Sound.click);
                break;
            case 'Tab':
                event.preventDefault();
                this.removeInstructionsControls();
                Sounds.play(Sound.click);
                break;
            default:
                break;
        }
    };

    private static addInstructionsButtons = (event: Event) => {
        event.preventDefault();
        const target = <HTMLElement>event.target;
        switch (true) {
            case target.classList.contains('options_buttons_pause'):
                this.removeInstructionsControls();
                Sounds.play(Sound.click);
                break;
            case target.classList.contains('options_buttons_settings'):
                this.removeInstructionsControls();
                Sounds.play(Sound.click);
                break;
            case target.classList.contains('launch__button'):
                this.removeInstructionsControls();
                Sounds.play(Sound.click);
                break;
            default:
                break;
        }
    };

    static setInstructionsControls() {
        this.removeControls();
        document.addEventListener('keydown', this.addInstructionsKeys);
        document.addEventListener('click', this.addInstructionsButtons);
        toggleElClass('info__screen', 'info__screen_hidden');
    }

    static removeInstructionsControls() {
        document.removeEventListener('keydown', this.addInstructionsKeys);
        document.removeEventListener('click', this.addInstructionsButtons);
        this.setControls();
        toggleElClass('info__screen', 'info__screen_hidden');
    }
}
