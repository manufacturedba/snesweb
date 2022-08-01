import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepacheWelcomeJumbotronComponent extends Component {
  @service
  router;

  @action
  transitionToMagwest() {
    this.router.transitionTo('authenticated.base.magwest');
  }
}
