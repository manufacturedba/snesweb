import Model, { attr } from '@ember-data/model';

/**
 * @class TepacheReport
 * @extends Model
 */
export default class TepacheReportModel extends Model {
  @attr('string')
  email;

  @attr('string')
  description;
}
