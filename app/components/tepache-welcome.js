import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class TepacheWelcomeComponent extends Component {
  @service
  router;

  @service
  pubnub;

  @service
  identifiedUser;

  @tracked
  lastAdminMessage;

  get adminChannel() {
    return `admin.${this.args?.gameSessionModel?.id}`;
  }

  @action
  async subscribeForHeartbeatController() {
    function clearAdminMessage() {
      this.lastAdminMessage = null;
    }

    this.pubnub.unsubscribeAll();
    this.pubnub.setUserId(this.identifiedUser.uid);

    this.pubnub.subscribe({
      channels: [this.adminChannel],
    });

    this.pubnub.addListener({
      message: async (message) => {
        this.lastAdminMessage = message;

        debounce(this, clearAdminMessage, 5000);
      },
    });
  }

  @action
  async unsubscribeForHeartbeatController() {
    this.pubnub.unsubscribeAll();
  }

  @action
  transitionToPlay() {
    // logEvent(getAnalytics(), 'game_controller_clicked');
    // this.router.transitionTo('authenticated.base.play');
  }
}
