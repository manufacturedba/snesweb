import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { GAME_SESSION_STATE } from 'tepacheweb/constants';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class TepacheGameSessionsTableComponent extends Component {
  @tracked
  showActiveOnly = true;

  get processedGameSessionCollection() {
    return this.args.gameSessionCollection
      .filter((gameSession) => {
        if (this.showActiveOnly) {
          return gameSession.state === GAME_SESSION_STATE.ACTIVE;
        }

        return true;
      })
      .sortBy('createdAt')
      .reverse();
  }

  @action
  toggleActiveOnly() {
    logEvent(getAnalytics(), 'toggle_active_only');
    this.showActiveOnly = !this.showActiveOnly;
  }
}
