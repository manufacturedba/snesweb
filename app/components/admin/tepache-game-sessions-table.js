import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { GAME_SESSION_STATE } from 'tepacheweb/constants';

export default class TepacheGameSessionsTableComponent extends Component {
  @tracked
  showActiveOnly = true;

  @service
  router;

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

  @action
  createNewGameSession() {
    logEvent(getAnalytics(), 'create_new_game_session');
    this.router.transitionTo('authenticated.base.admin.game-session-new');
  }
}
