import Model, { attr } from '@ember-data/model';

/**
 * @class TepacheGameModel
 * @extends Model
 */
export default class TepacheGameModel extends Model {
  @attr('string')
  title;

  @attr('string')
  urn;

  @attr('string')
  description;

  @attr('string')
  logo;

  /**
   * @type {String[]}
   */
  @attr
  playModes;

  /**
   * @type {Boolean}
   */
  @attr('boolean')
  active;

  @attr('timestamp')
  createdAt;
}
