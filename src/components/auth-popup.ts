import { checkedQuerySelector, appendEl, createEl } from './utils';
import { Controls } from './controls';
import { Auth } from './authentication';
import { Translate } from './translation';

export class RenderAuthPopup {
    static showPopup() {
        const body = checkedQuerySelector(document, 'body');
        const popupWrapper = createEl('popup__wrapper', 'div');
        const authBox = createEl('auth__box', 'div');
        const title = createEl('auth__box_title', 'h2');
        const titleError = createEl('auth__box_subtitle hide', 'h3');
        const inputName = <HTMLInputElement>createEl('username input-el hide', 'input');
        inputName.id = 'username';
        const inputEmail = <HTMLInputElement>createEl('email input-el checked', 'input');
        inputEmail.id = 'email';
        const inputPassword = <HTMLInputElement>createEl('password input-el checked', 'input');
        inputPassword.id = 'password';
        const authBoxButtons = <HTMLButtonElement>createEl('auth__box_buttons', 'button');
        const loginBtn = <HTMLButtonElement>createEl('login button', 'button');
        loginBtn.id = 'login';
        const signupBtn = <HTMLButtonElement>createEl('signup button hide', 'button');
        signupBtn.id = 'signup';
        const changeBtn = createEl('change text', 'button');
        changeBtn.id = 'change';

        appendEl(body, popupWrapper);
        appendEl(popupWrapper, authBox);
        appendEl(authBox, title);
        appendEl(authBox, titleError);
        appendEl(authBox, inputName);
        appendEl(authBox, inputEmail);
        appendEl(authBox, inputPassword);
        appendEl(authBox, authBoxButtons);
        appendEl(authBoxButtons, loginBtn);
        appendEl(authBoxButtons, signupBtn);
        appendEl(authBoxButtons, changeBtn);

        title.textContent = Translate.setLang().titlePopup.login;
        titleError.textContent = Translate.setLang().titleError.loginError;
        inputName.type = 'text';
        inputName.placeholder = Translate.setLang().inputName;
        inputEmail.type = 'email';
        inputEmail.placeholder = Translate.setLang().inputEmail;
        inputPassword.type = 'password';
        inputPassword.placeholder = Translate.setLang().inputPassword;
        loginBtn.textContent = Translate.setLang().loginBtn;
        loginBtn.disabled = true;
        signupBtn.textContent = Translate.setLang().signupBtn;
        signupBtn.disabled = true;
        changeBtn.textContent = Translate.setLang().changeBtn.signup;

        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm;

        inputName.addEventListener('input', () => {
            const name = inputName.value;
            RenderAuthPopup.activateLock(inputName, authBox, loginBtn);
            if (name.length < 3) {
                RenderAuthPopup.activateLock(inputName, authBox, loginBtn);
                RenderAuthPopup.activateLock(inputName, authBox, signupBtn);
            } else {
                RenderAuthPopup.deactivateLock(inputName, authBox, loginBtn);
                RenderAuthPopup.deactivateLock(inputName, authBox, signupBtn);
            }
        });

        inputEmail.addEventListener('input', () => {
            RenderAuthPopup.activateLock(inputEmail, authBox, loginBtn);
            if (inputEmail.value.match(regexEmail) === null) {
                RenderAuthPopup.activateLock(inputEmail, authBox, loginBtn);
                RenderAuthPopup.activateLock(inputName, authBox, signupBtn);
            } else {
                RenderAuthPopup.deactivateLock(inputEmail, authBox, loginBtn);
                RenderAuthPopup.deactivateLock(inputName, authBox, signupBtn);
            }
        });

        inputPassword.addEventListener('input', () => {
            const pass = inputPassword.value;
            RenderAuthPopup.activateLock(inputPassword, authBox, loginBtn);
            if (pass.length < 6) {
                RenderAuthPopup.activateLock(inputPassword, authBox, loginBtn);
                RenderAuthPopup.activateLock(inputName, authBox, signupBtn);
            } else {
                RenderAuthPopup.deactivateLock(inputPassword, authBox, loginBtn);
                RenderAuthPopup.deactivateLock(inputName, authBox, signupBtn);
            }
        });

        document.addEventListener('click', (e) => {
            const targetDocument = <HTMLDivElement>e.target;
            const its_details = targetDocument == authBox || authBox.contains(targetDocument);
            const details_is_active = authBox.classList.contains('auth__box');
            if (!its_details && details_is_active) {
                popupWrapper.remove();
                authBox.classList.add('close');
                authBox.remove();
                Controls.setControls();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                popupWrapper.remove();
                authBox.classList.add('close');
                authBox.remove();
                Controls.setControls();
            }
        });

        loginBtn.addEventListener('click', () => {
            Auth.logIn();
        });

        signupBtn.addEventListener('click', () => {
            Auth.signUp();
        });

        changeBtn.addEventListener('click', () => {
            Auth.change();
            inputName.value = '';
            inputEmail.value = '';
            inputPassword.value = '';
            titleError.classList.add('hide');
            inputName.classList.remove('error');
            inputName.classList.remove('check');
            inputEmail.classList.remove('error');
            inputEmail.classList.remove('check');
            inputPassword.classList.remove('error');
            inputPassword.classList.remove('check');
        });
    }

    private static activateLock(el: HTMLElement, form: HTMLElement, button: HTMLButtonElement) {
        el.classList.add('error');
        el.classList.remove('check');
        RenderAuthPopup.isFormDetailsSelected(form, button);
    }

    private static deactivateLock(el: HTMLElement, form: HTMLElement, button: HTMLButtonElement) {
        el.classList.add('check');
        el.classList.remove('error');
        RenderAuthPopup.isFormDetailsSelected(form, button);
    }

    private static isFormDetailsSelected(form: HTMLElement, btn: HTMLButtonElement) {
        const arrInputs = Array.from(form.querySelectorAll('.checked'));
        if (arrInputs.every((item) => item.classList.contains('check'))) {
            btn.disabled = false;
        }
        if (!arrInputs.every((item) => item.classList.contains('check'))) {
            btn.disabled = true;
        }
    }
}
