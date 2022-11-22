import Component from '@glimmer/component';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';
import { cached } from '@glimmer/tracking';
import { TrackedAsyncData } from 'ember-async-data';

export default class TepacheThumbnailComponent extends Component {
  @cached
  get imageUrl() {
    const isGoogleStorageURL = (urlString) => {
      try {
        return new URL(urlString)?.protocol === 'gs:';
      } catch (e) {
        return false;
      }
    };

    if (isGoogleStorageURL(this.args.thumbnail)) {
      const imageReference = ref(getStorage(), this.args.thumbnail);
      return new TrackedAsyncData(getDownloadURL(imageReference), this);
    } else {
      return new TrackedAsyncData(this.args.thumbnail, this);
    }
  }
}
