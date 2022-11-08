import { helper } from '@ember/component/helper';

export default helper(function shortDate([date]) {
  return date?.toLocaleDateString();
});
