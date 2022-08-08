import Component from '@glimmer/component';
import { TrackedAsyncData } from 'ember-async-data';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { cached } from '@glimmer/tracking';

export default class TepachePlayerEnterFormComponent extends Component {
  @service
  store;

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
    return await this.playerSessionModel.save();
  }

  /**
   * Possible session connected to the player.
   */
  @cached
  get playerSessionsAsyncData() {
    return new TrackedAsyncData(
      this.store.query('tepache-player-session', {
        gameSessionUrn: this.args.gameSessionModel.urn,
      }),
      this
    );
  }

  /**
   * API player session or new record if no session found.
   */
  get playerSessionModel() {
    return this.args.playerSessionModel || this.#fallbackPlayerSession;
  }
}
