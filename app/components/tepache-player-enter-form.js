import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class TepachePlayerEnterFormComponent extends Component {
  @service
  store;

  @service
  router;

  @action
  async submitToEnterRoom() {
    logEvent(getAnalytics(), 'submit_player_enter_form');
    await this.playerSessionModel.save();

    return this.router.transitionTo('authenticated.base.play.live');
  }

  /**
   * API player session or new record if no session found.
   */
  get playerSessionModel() {
    return this.args.playerSessionModel;
  }
}
