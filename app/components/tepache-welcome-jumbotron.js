import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

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

  get isDisabled() {
    const live = this.remoteConfig.getBoolean('live');

    if (!live) {
      return true;
    }

    if (!this.gameModel) {
      return true;
    }

    return false;
  }

  @action
  transitionToMagwest() {
    this.router.transitionTo('authenticated.base.magwest');
  }
}
