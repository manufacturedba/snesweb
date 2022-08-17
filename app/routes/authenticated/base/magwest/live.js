import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  limit,
  orderBy,
  query,
  where,
} from 'ember-cloud-firestore-adapter/firebase/firestore';
import { hash } from 'rsvp';

export default class MagwestLiveRoute extends Route {
  @service
  remoteConfig;

  @service
  store;

  @service
  router;

  async beforeModel() {
    const gameSession = this.modelFor('authenticated.base.index');
    const playerSession = this.modelFor('authenticated.base.magwest.index');

    if (!gameSession) {
      return this.router.transitionTo('authenticated.base.index');
    }

    if (!playerSession) {
      return this.router.transitionTo('authenticated.base.magwest.index');
    }
  }

  async model() {
    const gameSession = this.modelFor('authenticated.base.index');
    const playerSession = this.modelFor('authenticated.base.magwest');

    const hardwareInput = this.store.query('tepache-hardware-input', {
      isRealtime: true,

      filter(reference) {
        return query(
          reference,
          where('gameSessionUrn', '==', gameSession.urn),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      },
    });

    return hash({
      playerSession,
      gameSession,
      hardwareInput,
    });
  }
}
