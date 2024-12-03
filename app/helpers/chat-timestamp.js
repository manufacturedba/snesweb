import { helper } from '@ember/component/helper';

function zeroPad(num) {
  return num < 10 ? `0${num}` : num;
}

export default helper(function chatTimestamp([timetoken] /*, named*/) {
  const date = new Date(timetoken / 10000);
  return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`;
});
