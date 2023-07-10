import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getAnalytics, logEvent } from 'firebase/analytics';
import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';

function randomExtension() {
  return Math.round(Math.random() * 10000);
}

export default class TepachePlayerEnterFormComponent extends Component {
  @service
  store;

  @service
  router;

  @action
  async submitToEnterRoom(changeset) {
    logEvent(getAnalytics(), 'submit_player_enter_form');

    logEvent(getAnalytics(), 'submit_player_enter_form_named');

    await changeset.save();

    this.router.transitionTo('authenticated.base.play.live');
  }

  @action
  async goAnonymous() {
    logEvent(getAnalytics(), 'submit_player_enter_form');

    logEvent(getAnalytics(), 'submit_player_enter_form_anonymous');
    this.playerSessionModel.name = this.randomName;

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

  get playerSessionValidations() {
    return {
      name: [validatePresence(true), validateLength({ min: 1, max: 36 })],
    };
  }

  get randomName() {
    return `Anonymous${randomExtension()}`;
  }
}
