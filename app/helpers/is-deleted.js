import { helper } from '@ember/component/helper';
import { GAME_SESSION_STATE } from 'tepacheweb/constants';

export default helper(function isDeleted([state] /*, named*/) {
  return state === GAME_SESSION_STATE.DELETED;
});
