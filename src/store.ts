import Vue from 'vue';
import Vuex from 'vuex';
import uuid from 'uuid/v4';

Vue.use(Vuex);

export type Feed = {
  id: string;
  username: string;
  profilePictureUrl: string;
  date: Date;
  content: string;
}

export default new Vuex.Store({
  state: {
    feeds: <Feed[]>[],
    a: 1,
  },
  mutations: {
    addFeed(state, feed) {
      state.feeds.push(feed);
    },
    clearFeed(state) {
      state.feeds = [];
    },
  },
  actions: {
    loadingFeeds(context) {

      const feeds: Feed[] = [0, 1, 2, 3, 4].map((index) => {
        return {
          id: uuid(),
          username: `username${index}${(Math.random() * 1000).toFixed().padStart(4, '0')}`,
          profilePictureUrl: '/img/logo.82b9c7a5.png',
          date: new Date(),
          content: 'SEX',
        };
      });

      context.commit('clearFeed');

      feeds.forEach((feed) => {
        context.commit('addFeed', feed);
      });
    }
  },
});
