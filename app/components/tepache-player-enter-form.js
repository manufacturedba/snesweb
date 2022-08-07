import Component from '@glimmer/component';
import { TrackedAsyncData } from 'ember-async-data';
import { service } from '@ember/service';

export default class TepachePlayerEnterFormComponent extends Component {
  @service
  store;

  get playerSession() {
    return new TrackedAsyncData(
      this.store.query('tepache-player-session', {
        gameSessionUrn: this.args.gameSessionModel.urn,
      }),
      this
    );
  }
}
