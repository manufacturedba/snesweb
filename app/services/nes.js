import Service from '@ember/service';
import config from 'tepacheweb/config/environment';
import { Client } from '@hapi/nes/lib/client';
import { assert } from '@ember/debug';
import { service } from '@ember/service';

export default class NesService extends Service {
  @service
  session;

  #client;

  #connectionRequest;

  constructor() {
    super(...arguments);
    const host = config['hapi-nes'].host;

    assert('hapi-nes host is required', host);

    this.#client = new Client(host);

    this.#connectionRequest = this.#client.connect({
      auth: {
        headers: {
          authorization: `Basic ${this.session?.data?.authenticated?.user?.accessToken}`,
        },
      },
    });
  }

  async request(path, payload) {
    await this.#connectionRequest;
    return await this.#client.request(path, payload);
  }

  get connected() {
    return this.#client.id;
  }
}
