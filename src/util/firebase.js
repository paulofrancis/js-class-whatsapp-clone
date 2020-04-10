const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor() {

        this._config = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: ""
        };

        this.init();
    }

    init() {

        if (!window._initializedFirebase) {

            firebase.initializeApp(this._config);
            window._initializedFirebase = true;
        }
    }

    initAuth() {

        return new Promise((s, f) => {

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(result => {

                    let token = result.credential.accessToken;
                    let user = result.user;

                    s({
                        user,
                        token
                    });
                })
                .catch(err => {
                    f(err);
                });

        });
    }

    static db() {
        return firebase.firestore();
    }

    static hd() {
        return firebase.storage();
    }

}