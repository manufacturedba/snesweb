import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PlatformSerializer extends JSONAPISerializer {
  keyForAttribute(key) {
    return key;
  }
}
