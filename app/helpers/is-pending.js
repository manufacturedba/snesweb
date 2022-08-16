import { helper } from '@ember/component/helper';
import { GAME_SESSION_STATE } from '../constants';

export default helper(function isPending([state] /*, named*/) {
  return state === GAME_SESSION_STATE.PENDING;
});
