import Model, { attr } from '@ember-data/model';

export default class TepacheAdminModel extends Model {
  @attr('number')
  role;
}
