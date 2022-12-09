import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getAnalytics, logEvent } from 'firebase/analytics';

function randomExtension() {
  return Math.round(Math.random() * 10000);
}

export default class TepachePlayerEnterFormComponent extends Component {
  @service
  store;

  @service
  router;

  @action
  async submitToEnterRoom() {
    logEvent(getAnalytics(), 'submit_player_enter_form');

    if (!this.playerSessionModel.name) {
      logEvent(getAnalytics(), 'submit_player_enter_form_anonymous');
      this.playerSessionModel.name = `Anonymous${randomExtension()}`;
    } else {
      logEvent(getAnalytics(), 'submit_player_enter_form_named');
    }

    if (this.playerSessionModel.hasDirtyAttributes) {
      await this.playerSessionModel.save();
    }

    this.router.transitionTo('authenticated.base.play.live');
  }

  /**
   * API player session or new record if no session found.
   */
  get playerSessionModel() {
    return this.args.playerSessionModel;
  }
}
