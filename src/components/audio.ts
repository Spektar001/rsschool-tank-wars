import { State } from './state';
import { checkedQuerySelector } from './utils';

export class Sounds {
    static play(name: string, num = 1) {
        const audio = new Audio(`../assets/audio/${name}.mp3`);
        if (State.settings.sound === 'OFF') {
            audio.volume = 0;
        } else {
            audio.volume = +`${num}`;
        }
        audio.play();
    }

    static playIntro() {
        const intro = <HTMLAudioElement>checkedQuerySelector(document, 'audio');

        State.settings.sound === 'OFF' ? (intro.volume = 0) : (intro.volume = 0.05);
        intro.play();
    }
}
