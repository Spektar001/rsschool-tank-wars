import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_NAME } from '../common/constants';
import { checkedQuerySelector, createEl } from './utils';
import { Game } from './game';
import { Player } from './player';
import { Controls } from './controls';
import { State } from './state';
import { Sounds } from './audio';
import { Translate } from './translation';
import './styles/console.css';
import './styles/launch.css';
import './styles/home.css';
import './styles/game.css';
import './styles/winner.css';
import './styles/menu.css';
import './styles/instructions.css';
import './styles/pause.css';
import './styles/authentication.css';
import { Color } from './color';

export class Page {
    static body = checkedQuerySelector(document, 'body');

    static renderConsole() {
        this.body.innerHTML = `
        <div class="game__console">
            <div class="main__screen">
                <div class="game__screen"></div>
                <div class="info__screen info__screen_hidden"></div>
            </div>
            <div class="game__controls">
                <div class="game__controls_circle">
                    <div class="game__controls_cross">
                    <button class="cross__arrow cross__arrow_left"></button>
                    <div class="cross__vertical">
                        <button class="cross__arrow cross__arrow_up"></button>
                        <button class="cross__arrow cross__arrow_down"></button>
                    </div>
                    <button class="cross__arrow cross__arrow_right"></button>
                    </div>
                </div>
                <div class="game__controls_options">
                    <div class="game__naming">
                        <span class="naming__rs"><a class="naming__rs_link" href="https://rs.school">RsSchool</a> Console</span>
                    </div>
                    <div class="cross__options_buttons">
                        <button class="options_button options_buttons_pause"></button>
                        <button class="options_button options_buttons_settings"></button>
                    </div>
                    <div class="cross__options_text">
                        <span class="options_text options_text_pause">${Translate.setLang().pauseBtn}</span>
                        <span class="options_text options_text_settings">${Translate.setLang().settingsBtn}</span>
                    </div>
                </div>
                <div class="game__controls_circle">
                    <button class="launch__button">${Translate.setLang().fireBtn}</button>
                </div>
            </div>
            <audio сlass="game__audio" src="../assets/audio/intro.mp3" loop></audio>
        </div>
        `;

        Color.setConsoleColor();
    }

    static renderLaunch() {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="launch__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <div class="launch__menu">
                <button class="launch__menu_btn menu__item menu__item_selected" id="btn_launch">${
                    Translate.setLang().launchBtn
                }</button>
            </div>
            <div class="launch__footer">
                <a class="launch__rslink" href="https://rs.school/js/"></a>
                <div class="launch__footer_container">
                    <a class="launch__github" href="https://github.com/Spektar001">Spektar001</a>
                    <a class="launch__github" href="https://github.com/vigo44">vigo44</a>
                    <a class="launch__github" href="https://github.com/LoginamNet">LoginamNet</a>
                </div>
                <span class="launch__year">2023</span>
            </div>
        </div>
        `;

        Controls.removeControls();
        screen.innerHTML = template;
        State.settings.screen = 'LAUNCH';
        Controls.setControls();
    }

    static renderHome() {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="home__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <h1 class="home__screen_title">TANK WARS</h1>
            <h2 class="home__screen_subtitle" id="subTitle"> ${
                Translate.setLang().subTitle + ' ' + State.settings.username
            }</h2>
            <div class="screen__menu">
                <div class="menu__item_players menu__item menu__item_selected">
                    <span id="players_num">${Translate.setLang().playersNum}</span>
                    <div class="menu__switchers">
                        <div class="menu__switcher" id="2">2</div>
                        <div class="menu__switcher" id="3">3</div>
                        <div class="menu__switcher" id="4">4</div>
                    </div>
                </div>
                <div class="menu__item_sound menu__item">
                    <span id="sound">${Translate.setLang().sound}</span>
                    <div class="menu__switchers">
                        <div class="menu__switcher" id="ON">${Translate.setLang().soundON}</div>
                        <div class="menu__switcher" id="OFF">${Translate.setLang().soundOFF}</div>
                    </div>
                </div>
                <div class="menu__item_color menu__item">
                    <span id="color">${Translate.setLang().color}</span>
                    <div class="menu__switchers">
                        <div class="menu__switcher menu__switcher_color color_sand" id="SAND">•</div>
                        <div class="menu__switcher menu__switcher_color color_blue" id="BLUE">•</div>
                        <div class="menu__switcher menu__switcher_color color_black" id="BLACK">•</div>
                    </div>
                </div>
                <div class="menu__item_language menu__item">
                    <span id="lang">${Translate.setLang().lang}</span>
                    <div class="menu__switchers">
                        <div class="menu__switcher" id="EN">EN</div>
                        <div class="menu__switcher" id="РУС">РУС</div>
                    </div>
                </div>
                <button class="menu__item" id="btn_auth">${
                    State.settings.username === DEFAULT_NAME ? Translate.setLang().auth : Translate.setLang().authOut
                }</button>
                <button class="menu__item" id="btn_instructions">${Translate.setLang().inst}</button>
                <button class="menu__item" id="btn_start">${Translate.setLang().start}</button>
            </div>
        </div>
        `;

        Controls.removeControls();
        screen.innerHTML = template;
        State.settings.screen = 'HOME';
        State.setMenuItems();
        Controls.setControls();
    }

    static renderGame() {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="game__screen_game">
            <div class="game__canvas" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
                <canvas class="canvas canvas_background" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
                <canvas class="canvas canvas_tank" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
                <canvas class="canvas canvas_animation" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
                <canvas class="canvas canvas_ui" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
            </div>
            <div class="game__menu_container game__menu_hidden" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px"">
                <div class="screen__menu">
                    <div class="menu__item_sound menu__item item menu__item_selected">
                        <span id="sound">${Translate.setLang().sound}</span>
                        <div class="menu__switchers">
                            <div class="menu__switcher" id="ON">${Translate.setLang().soundON}</div>
                            <div class="menu__switcher" id="OFF">${Translate.setLang().soundOFF}</div>
                        </div>
                    </div>
                    <div class="menu__item_language menu__item">
                        <span id="lang">${Translate.setLang().lang}</span>
                        <div class="menu__switchers">
                            <div class="menu__switcher" id="EN">EN</div>
                            <div class="menu__switcher" id="РУС">РУС</div>
                        </div>
                    </div>
                    <button class="menu__item" id="btn_instructions">${Translate.setLang().inst}</button>
                    <button class="menu__item" id="btn_back">${Translate.setLang().back}</button>
                    <button class="menu__item" id="btn_menu">${Translate.setLang().menu}</button>
                </div>
            </div>
        </div>
        </div>
        <div class="game__screen_data">
            <div class="data__controls">
                <div class="data__controls_section">
                    <div class="angle"></div>
                    <div class="power"></div>
                </div>
                <div class="data__controls_section section_big">
                    <div class="wind"></div>
                    <div class="player__info">
                        <div class="player"></div>
                        <div class="color"></div>
                    </div>
                </div>
                <div class="data__controls_section">
                    <div class="time"></div>
                </div>
            </div>
        </div>
        `;

        screen.innerHTML = template;
        State.settings.screen = 'GAME';
        State.setMenuItems();
        const game = new Game();
        game.start();
    }

    static renderWinner(currentPl: Player) {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="winner__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <div class="winner__image_container">
                <div class="winner__image"></div>
            </div>
            <div>${currentPl.name} ${Translate.setLang().winnerText}</div>
            <div class="screen__menu">
                <button class="menu__item menu__item_selected winner__screen_restart" id="btn_restart">
                    ${Translate.setLang().restart}
                </button>
            </div>
        </div>
        `;

        screen.innerHTML = template;
        State.settings.screen = 'WINNER';
        Sounds.play('winner', 0.5);
    }

    static renderInstructions() {
        const screen = checkedQuerySelector(document, '.info__screen');
        const template = `
        <div class="instructions__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <div class="instructions__conraiter">
                <h2>${Translate.setLang().instructions.header}</h2>
                <span>${Translate.setLang().instructions.info}</span>
                <ul class="instructions__list">
                    <li class="instructions__list_item">${Translate.setLang().instructions.up}</li>
                    <li class="instructions__list_item">${Translate.setLang().instructions.down}</li>
                    <li class="instructions__list_item">${Translate.setLang().instructions.left}</li>
                    <li class="instructions__list_item">${Translate.setLang().instructions.right}</li>
                    <li class="instructions__list_item">${Translate.setLang().instructions.space}</li>
                    <li class="instructions__list_item">${Translate.setLang().instructions.pause}</li>
                    <li class="instructions__list_item">${Translate.setLang().instructions.esc}</li>
                </ul>
                <button class="instructions__button_back">${Translate.setLang().instructions.back}</button>
        </div>
        `;

        screen.innerHTML = template;
        Controls.setInstructionsControls();
    }

    static renderPause() {
        const screen = checkedQuerySelector(document, '.game__screen');
        const pause = createEl('screen__pause', 'div');
        const template = `
            <div class="pause__text">${Translate.setLang().gamePaused}</div>
        `;

        pause.innerHTML = template;

        if (document.querySelector('.screen__pause') === null) {
            screen.append(pause);
        }
    }

    static removePause() {
        if (document.querySelector('.screen__pause') !== null) {
            const pause = checkedQuerySelector(document, '.screen__pause');

            pause.remove();
        }
    }
}
