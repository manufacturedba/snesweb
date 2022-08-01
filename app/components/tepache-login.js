import Component from '@glimmer/component';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepacheLoginComponent extends Component {
  @service
  session;

  @service
  router;

  get email() {
    return this.session?.data?.authenticated?.user?.email;
  }

  @action
  startUI(element) {
    var uiConfig = {
      autoUpgradeAnonymousUsers: false,

      signInSuccessUrl: '/',

      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          this.session
            .authenticate('authenticator:firebase', () => {
              return authResult;
            })
            .finally(() =>
              this.router.transitionTo('authenticated.base.index')
            );

          return false;
        },
        signInFailure: (error) => {
          console.error(error);

          if (error.credential) {
            this.session
              .authenticate('authenticator:firebase', () => error.credential)
              .finally(() =>
                this.router.transitionTo('authenticated.construction')
              );
          } else {
            this.router.transitionTo('authenticated.construction');
          }
        },
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
    // The start method will wait until the DOM is loaded.
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    this.ui.start(element.querySelector('[data-firebase-ui]'), uiConfig);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.ui.reset();
  }
}