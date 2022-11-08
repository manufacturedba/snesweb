import { helper } from '@ember/component/helper';

export default helper(function lowercase([char]) {
  return char?.toLowerCase();
});
