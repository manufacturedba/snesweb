import Model, { attr } from '@ember-data/model';

export default class TepachePlayerSessionModel extends Model {
  /**
   * @deprecated
   */
  @attr('string')
  urn;

  @attr('string')
  name;

  /**
   * @deprecated
   */
  @attr('string')
  gameSessionUrn;

  @attr('string')
  gameSessionId;

  @attr('string')
  uid;

  /**
   * @type {String[]}
   */
  @attr('string')
  state;

  @attr('timestamp')
  createdAt;

  @attr('timestamp')
  lastActivityAt;
}
