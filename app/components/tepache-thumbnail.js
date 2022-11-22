import Component from '@glimmer/component';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';
import { cached } from '@glimmer/tracking';
import { TrackedAsyncData } from 'ember-async-data';

export default class TepacheThumbnailComponent extends Component {
  @cached
  get imageUrl() {
    const isValidUrl = (urlString) => {
      try {
        return Boolean(new URL(urlString));
      } catch (e) {
        return false;
      }
    };

    if (isValidUrl(this.args.thumbnail)) {
      return new TrackedAsyncData(this.args.thumbnail, this);
    } else {
      const imageReference = ref(getStorage(), this.args.thumbnail);
      return new TrackedAsyncData(getDownloadURL(imageReference), this);
    }
  }
}
