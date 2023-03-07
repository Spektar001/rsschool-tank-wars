import { checkedID, checkedQuerySelector } from './utils';
import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, update, get, child } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { State } from './state';
import { Page } from './pages';
import { DEFAULT_NAME } from '../common/constants';
import { Storage } from './storage';
import { Translate } from './translation';
import { Color } from './color';
import { Sounds } from './audio';

export class Auth {
    static firebaseConfig = {
        apiKey: 'AIzaSyAmH9oGo2UXL2uzRtZ50VHUBdKSmkG9vew',
        authDomain: 'tank-wars-e409a.firebaseapp.com',
        databaseURL: 'https://tank-wars-e409a-default-rtdb.firebaseio.com',
        projectId: 'tank-wars-e409a',
        storageBucket: 'tank-wars-e409a.appspot.com',
        messagingSenderId: '1048364796625',
        appId: '1:1048364796625:web:016660a2fb67ca40a893f0',
    };
    static app = initializeApp(Auth.firebaseConfig);
    static database = getDatabase(Auth.app);
    static auth = getAuth();

    static change() {
        const changeBtn = checkedID(document, 'change');
        changeBtn.textContent === Translate.setLang().changeBtn.signup ? Auth.changeOnSignUp() : Auth.changeOnLogin();
    }

    static changeOnSignUp() {
        const changeBtn = checkedID(document, 'change');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const title = checkedQuerySelector(document, '.auth__box_title');
        const username = <HTMLInputElement>checkedQuerySelector(document, '.username');

        loginBtn.classList.add('hide');
        username.classList.remove('hide');
        username.classList.add('checked');
        signupBtn.classList.remove('hide');
        changeBtn.textContent = Translate.setLang().changeBtn.login;
        title.textContent = Translate.setLang().titlePopup.registration;
    }

    static changeOnLogin() {
        const changeBtn = checkedID(document, 'change');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const title = checkedQuerySelector(document, '.auth__box_title');
        const username = <HTMLInputElement>checkedQuerySelector(document, '.username');

        loginBtn.classList.remove('hide');
        username.classList.add('hide');
        username.classList.remove('checked');
        signupBtn.classList.add('hide');
        changeBtn.textContent = Translate.setLang().changeBtn.signup;
        title.textContent = Translate.setLang().titlePopup.login;
    }

    static signUp() {
        const username = <HTMLInputElement>checkedQuerySelector(document, '.username');
        const email = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const password = <HTMLInputElement>checkedQuerySelector(document, '.password');
        const popupWrapper = checkedQuerySelector(document, '.popup__wrapper');
        const authBox = checkedQuerySelector(document, '.auth__box');
        const titleError = checkedQuerySelector(document, '.auth__box_subtitle');

        createUserWithEmailAndPassword(Auth.auth, email.value, password.value)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                set(ref(Auth.database, 'users/' + user.uid), {
                    username: username.value,
                    email: user.email,
                    state: JSON.stringify(State.settings),
                });
                State.settings.username = username.value;
                State.settings.statusAuth = 'LOGOUT';
                username.value = '';
                email.value = '';
                password.value = '';
                popupWrapper.remove();
                authBox.classList.add('close');
                Page.renderHome();
            })
            .catch((error) => {
                const errorMessage = error.message;
                titleError.textContent = Translate.setLang().titleError.emailError;
                titleError.classList.remove('hide');
                email.classList.remove('check');
                email.classList.add('error');
                console.log(errorMessage);
            });
    }

    static logIn() {
        const email = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const password = <HTMLInputElement>checkedQuerySelector(document, '.password');
        const popupWrapper = checkedQuerySelector(document, '.popup__wrapper');
        const authBox = checkedQuerySelector(document, '.auth__box');
        const titleError = checkedQuerySelector(document, '.auth__box_subtitle');

        signInWithEmailAndPassword(Auth.auth, email.value, password.value)
            .then((userCredential) => {
                // Log in
                const user = userCredential.user;
                const dt = new Date();
                const dbRef = ref(getDatabase());
                update(ref(Auth.database, 'users/' + user.uid), {
                    last_login: dt,
                });
                get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        State.settings = JSON.parse(data.state);
                        Page.renderHome();
                        Color.setConsoleColor();
                        Sounds.playIntro();
                        Storage.setStorage('settings');
                    } else {
                        console.log('No data available');
                    }
                });
                State.settings.statusAuth = 'LOGOUT';
                titleError.classList.add('hide');
                email.value = '';
                password.value = '';
                popupWrapper.remove();
                authBox.classList.add('close');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                titleError.classList.remove('hide');
            });
    }

    static logOut() {
        signOut(Auth.auth)
            .then(() => {
                // Sign-out successful
                console.log(`loged out`);
                State.settings.statusAuth = 'LOGIN/SIGNUP';
                State.settings.username = DEFAULT_NAME;
                Storage.setStorage('settings');
                Page.renderHome();
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    static updateState() {
        const dt = new Date();
        const user = Auth.auth.currentUser;
        if (user !== null) {
            update(ref(Auth.database, 'users/' + user.uid), {
                last_login: dt,
                state: JSON.stringify(State.settings),
            });
        }
    }
}
