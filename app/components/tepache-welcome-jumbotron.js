import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getAnalytics, logEvent } from 'firebase/analytics';
/**
 * @class TepacheWelcomeJumbotron
 * @extends Ember.Component
 * @example {{tepache-welcome-jumbotron @gameModel=@gameModel}}
 */
export default class TepacheWelcomeJumbotronComponent extends Component {
  @service
  router;

  @service
  remoteConfig;

  get ovenPlayerConfig() {
    const ovenPlayerConfigJSON =
      this.remoteConfig.getString('ovenplayer_config');

    return JSON.parse(ovenPlayerConfigJSON);
  }

  get isDisabled() {
    const live = this.remoteConfig.getBoolean('live');

    if (!live) {
      return true;
    }

    return false;
  }

  get backgroundImage() {
    return this.ovenPlayerConfig?.image;
  }

  @action
  transitionToPlay() {
    logEvent(getAnalytics(), 'play_button_clicked');
    this.router.transitionTo('authenticated.base.play');
  }
}
