import { State } from './state';
import { EN, RU } from '../common/languages';
import { checkedID, checkedQuerySelector } from './utils';
import { DEFAULT_NAME } from '../common/constants';

export class Translate {
    static setLang() {
        return State.settings.language === 'EN' ? EN : RU;
    }

    private static setBtnsLang() {
        const pauseBtn = checkedQuerySelector(document, '.options_text_pause');
        const settingsBtn = checkedQuerySelector(document, '.options_text_settings');
        const fireBtn = checkedQuerySelector(document, '.launch__button');

        pauseBtn.textContent = this.setLang().pauseBtn;
        settingsBtn.textContent = this.setLang().settingsBtn;
        fireBtn.textContent = this.setLang().fireBtn;
    }

    private static setMainMenuLang() {
        const subTitle = checkedID(document, 'subTitle');
        const menuPlayers = checkedID(document, 'players_num');
        const menuSound = checkedID(document, 'sound');
        const menuSoundON = checkedID(document, 'ON');
        const menuSoundOFF = checkedID(document, 'OFF');
        const menuColor = checkedID(document, 'color');
        const menuLang = checkedID(document, 'lang');
        const menuAuthBtn = checkedID(document, 'btn_auth');
        const menuInstrBtn = checkedID(document, 'btn_instructions');
        const menuStartBtn = checkedID(document, 'btn_start');

        subTitle.textContent = this.setLang().subTitle + ' ' + State.settings.username;
        menuPlayers.innerHTML = this.setLang().playersNum;
        menuSound.innerHTML = this.setLang().sound;
        menuSoundON.innerHTML = this.setLang().soundON;
        menuSoundOFF.innerHTML = this.setLang().soundOFF;
        menuColor.innerHTML = this.setLang().color;
        menuLang.innerHTML = this.setLang().lang;
        menuAuthBtn.innerHTML = State.settings.username === DEFAULT_NAME ? this.setLang().auth : this.setLang().authOut;
        menuInstrBtn.innerHTML = this.setLang().inst;
        menuStartBtn.innerHTML = this.setLang().start;
    }

    private static setGameMenuLang() {
        const menuSound = checkedID(document, 'sound');
        const menuSoundON = checkedID(document, 'ON');
        const menuSoundOFF = checkedID(document, 'OFF');
        const menuLang = checkedID(document, 'lang');
        const menuInstrBtn = checkedID(document, 'btn_instructions');
        const menuBackToGameBtn = checkedID(document, 'btn_back');
        const menuBackToMenuBtn = checkedID(document, 'btn_menu');

        menuSound.innerHTML = this.setLang().sound;
        menuSoundON.innerHTML = this.setLang().soundON;
        menuSoundOFF.innerHTML = this.setLang().soundOFF;
        menuLang.innerHTML = this.setLang().lang;
        menuInstrBtn.innerHTML = this.setLang().inst;
        menuBackToGameBtn.innerHTML = this.setLang().back;
        menuBackToMenuBtn.innerHTML = this.setLang().menu;

        if (document.querySelector('.pause__text') !== null) {
            const pause = checkedQuerySelector(document, '.pause__text');

            pause.innerHTML = this.setLang().gamePaused;
        }
    }

    static setMenuLang() {
        State.settings.screen === 'HOME' ? this.setMainMenuLang() : this.setGameMenuLang();
        this.setBtnsLang();
    }
}
