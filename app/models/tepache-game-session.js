import Model, { attr } from '@ember-data/model';

export default class TepacheGameSessionModel extends Model {
  @attr('string')
  name;

  @attr('string')
  description;

  @attr('string')
  logo;

  /**
   * @deprecated
   */
  @attr('string')
  urn;

  /**
   * @type {String[]}
   * @deprecated
   */
  @attr('string')
  gameUrn;

  /**
   * @type {String[]}
   */
  @attr('string')
  gameId;

  /**
   * @type {Boolean}
   */
  @attr('string')
  state;

  @attr
  stateHistory;

  @attr('string')
  playMode;

  @attr('timestamp')
  expiresAt;

  @attr('timestamp')
  createdAt;
}
