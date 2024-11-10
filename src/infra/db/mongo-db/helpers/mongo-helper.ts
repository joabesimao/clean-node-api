import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: any): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url, {});
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url);
    }

    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithOutId } = collection;
    return Object.assign({}, collectionWithOutId, { id: _id });
  },
};
