import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  query,
  where,
  limit,
} from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BaseIndexRoute extends Route {
  @service
  store;

  @service
  remoteConfig;

  async model() {
    const magWestUrn = this.remoteConfig.getString('magwest_urn');
    const live = this.remoteConfig.getBoolean('live');

    if (live && magWestUrn) {
      const games = await this.store.query('tepache-game', {
        queryId: magWestUrn,

        filter(reference) {
          return query(
            reference,
            where('active', '==', true),
            where('urn', '==', magWestUrn),
            limit(1)
          );
        },
      });

      return games.firstObject;
    }
  }
}
