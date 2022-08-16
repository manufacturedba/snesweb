import { helper } from '@ember/component/helper';

export default helper(function capitalize([stringToCapitalize]) {
  return stringToCapitalize.toUpperCase();
});
