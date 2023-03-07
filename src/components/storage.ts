import { State } from './state';

export class Storage {
    static setStorage(name: string): void {
        localStorage.setItem(name, JSON.stringify(State.settings));
    }
    static getStorage(name: string): void {
        if (localStorage.getItem(name) !== null) State.settings = JSON.parse(localStorage.getItem(name) || '');
    }

    static beforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.setStorage('settings');
        });
    }

    static load() {
        this.getStorage('settings');
    }
}
