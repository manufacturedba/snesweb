import Component from '@glimmer/component';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepacheLoginComponent extends Component {
  @service
  session;

  @action
  startUI(element) {
    // FirebaseUI config.
    var uiConfig = {
      autoUpgradeAnonymousUsers: true,

      signInSuccessUrl: '/',

      signInSuccessWithAuthResult: function (authResult) {
        return this.session.authenticate('authenticator:firebase', () => {
          return authResult;
        });
      },

      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
      ],
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl: 'https://tepachemode.com/terms',
      // Privacy policy url/callback.
      privacyPolicyUrl: 'https://tepachemode.com/privacy',
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start(element.querySelector('[data-firebase-ui]'), uiConfig);
  }
}
