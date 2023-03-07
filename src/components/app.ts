import { Page } from './pages';
import { Storage } from './storage';

export class App {
    local() {
        Storage.load();
        Storage.beforeUnload();
    }
    render() {
        this.local();
        Page.renderConsole();
        Page.renderLaunch();
    }
}
