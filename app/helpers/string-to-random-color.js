import { helper } from '@ember/component/helper';

function generateBrightHexColor() {
  const getBrightValue = () => Math.floor(Math.random() * 156) + 100;
  const red = getBrightValue();
  const green = getBrightValue();
  const blue = getBrightValue();

  const toHex = (value) => value.toString(16).padStart(2, '0');
  const hexColor = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;

  return hexColor;
}

export default helper(function stringToRandomColor([plainText] /*, named*/) {
  return generateBrightHexColor(plainText);
});
