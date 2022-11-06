import Service from '@ember/service';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';

export default class AuthuiService extends Service {
  constructor() {
    super(...arguments);
    this._ui = new firebaseui.auth.AuthUI(firebase.auth());
  }

  get ui() {
    return this._ui;
  }
}
