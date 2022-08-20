import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import OvenPlayer from 'ovenplayer';
import { Promise } from 'rsvp';
import { assert } from '@ember/debug';

const EVENT_MAP = {
  ready: 'onReady',
  metaChanged: 'onMetaChanged',
  stateChanged: 'onStateChanged',
  resized: 'onResized',
  playbackRateChanged: 'onPlaybackRateChanged',
  seek: 'onSeek',
  seeked: 'onSeeked',
  time: 'onTime',
  bufferChanged: 'onBufferChanged',
  mute: 'onMute',
  volumeChanged: 'onVolumeChanged',
  playlistChanged: 'onPlaylistChanged',
  sourceChanged: 'onSourceChanged',
  qualityLevelChanged: 'onQualityLevelChanged',
  cueChanged: 'onCueChanged',
  timeDisplayModeChanged: 'onTimeDisplayModeChanged',
  adChanged: 'onAdChanged',
  adTime: 'onAdTime',
  adComplete: 'onAdComplete',
  fullscreenChanged: 'onFullscreenChanged',
  clicked: 'onClicked',
  allPlaylistEnded: 'onAllPlaylistEnded',
  hlsPrepared: 'onHlsPrepared',
  hlsDestroyed: 'onHlsDestroyed',
  dashPrepared: 'onDashPrepared',
  dashDestroyed: 'onDashDestroyed',
  destroy: 'onDestroy',
};

const attemptReconnectTime = 1000;

export default class OvenPlayerComponent extends Component {
  @tracked
  playerInstance;

  @tracked
  inErrorState = false;

  constructor() {
    super(...arguments);

    const debug = this.args.debug || false;
    OvenPlayer.debug(debug);

    assert('You must provide options', this.args.options);
  }

  @action
  createPlayer(element) {
    return new Promise((resolve, reject) => {
      try {
        const instanceWrapper = element.querySelector(
          '.ovenplayer__instance-wrapper'
        );

        const onceEvents = this.args.once || {};

        this.playerInstance = OvenPlayer.create(instanceWrapper, {
          ...this.args.options,
        });

        this.playerInstance.on('error', (error) => {
          console.error(error);
          if (error.code > 500) {
            this.inErrorState = true;
            setTimeout(() => {
              this.playerInstance.load({ sources: this.args.options.sources });
            }, attemptReconnectTime);
          }
        });

        this.playerInstance.on('stateChanged', ({ newstate }) => {
          if (newstate !== 'error') {
            this.inErrorState = false;
          }
        });

        Object.keys(onceEvents).map((eventName) => {
          this.playerInstance.once(eventName, onceEvents[eventName]);
        });

        Object.entries(EVENT_MAP).forEach(([eventName, componentArgName]) => {
          if (this.args[componentArgName]) {
            this.playerInstance.on(eventName, this.args[componentArgName]);
          }
        });

        this.playerInstance.once('ready', () => resolve());
        this.playerInstance.once('stateChanged', ({ newstate }) => {
          if (newstate === 'error') {
            reject(new Error('OvenPlayer error'));
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  @action
  blockPausing(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  @action
  remove() {
    this.playerInstance.remove();
  }
}
