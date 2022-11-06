import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepachePlayerEnterFormComponent extends Component {
  @service
  store;

  @service
  router;

  @action
  async submit() {
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
