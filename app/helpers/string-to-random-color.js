import { helper } from '@ember/component/helper';

function generateBrightHexColor(inputString) {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
  }

  const getBrightValue = (value) => (value % 156) + 100;
  const red = getBrightValue(hash & 0xff);
  const green = getBrightValue((hash >> 8) & 0xff);
  const blue = getBrightValue((hash >> 16) & 0xff);

  const toHex = (value) => value.toString(16).padStart(2, '0');
  const hexColor = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;

  return hexColor;
}

export default helper(function stringToRandomColor([plainText] /*, named*/) {
  return generateBrightHexColor(plainText);
});
