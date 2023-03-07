import { ROUND_TIME } from '../common/constants';
import { checkedQuerySelector } from './utils';
import { Page } from './pages';
import { State } from './state';
import { Translate } from './translation';

export class Timer {
    static roundTime = ROUND_TIME;
    static timerIsOn = false;
    static timeInt: ReturnType<typeof setInterval>;

    static startTimer() {
        this.renderTime();
        this.timerIsOn = true;
        Page.removePause();

        this.timeInt = setInterval(() => {
            if (this.roundTime > 0) {
                this.roundTime--;
                this.renderTime();
            } else if (!State.game.currentPl?.isFired) {
                this.checkTime();
                this.setTime();
            }
            return this.roundTime;
        }, 1000);
    }

    static stopTimer() {
        this.renderTime();
        this.timerIsOn = false;
        clearInterval(this.timeInt);
        Page.renderPause();
    }

    static switchTimer() {
        this.timerIsOn ? this.stopTimer() : this.startTimer();
    }

    static renderTime() {
        const timeText = checkedQuerySelector(document, '.time');
        timeText.innerHTML = Translate.setLang().screen.time + this.roundTime.toString().padStart(2, '0');
    }

    static resetTime() {
        this.roundTime = ROUND_TIME;
    }

    static setTime() {
        this.resetTime();
        this.renderTime();
    }

    // if time per round is over switch to next player

    static checkTime() {
        if (State.game.currentPl) {
            const i = State.game.players.indexOf(State.game.currentPl);

            if (this.roundTime === 0 && !State.game.currentPl.isFired) {
                State.game.currentPl.projectileTrajectory = [];
                State.game.currentPl =
                    State.game.players.length - 1 !== i ? State.game.players[i + 1] : State.game.players[0];
                State.game.currentPl.setPlayerInfo();
            }
        }
    }
}
