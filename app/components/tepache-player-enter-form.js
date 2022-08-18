import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepachePlayerEnterFormComponent extends Component {
  @service
  store;

  @service
  router;

  #fallbackPlayerSession;

  constructor() {
    super(...arguments);

    this.#fallbackPlayerSession = this.store.createRecord(
      'tepache-player-session',
      {
        gameSessionUrn: this.args.gameSessionModel.urn,
      }
    );
  }

  @action
  async submit() {
    await this.playerSessionModel.save();

    return this.router.transitionTo('authenticated.live');
  }

  /**
   * API player session or new record if no session found.
   */
  get playerSessionModel() {
    return this.args.playerSessionModel || this.#fallbackPlayerSession;
  }
}
