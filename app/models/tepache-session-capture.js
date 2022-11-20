import Model, { attr } from '@ember-data/model';

export default class TepacheSessionCaptureModel extends Model {
  /**
   * @deprecated
   */
  @attr('string')
  playerSessionUrn;

  @attr('string')
  playerSessionId;

  @attr('string')
  button;

  @attr('timestamp')
  createdAt;
}
