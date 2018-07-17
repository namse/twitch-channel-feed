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

function generateRandomContent(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789가나다라마바사아아아라나나다라마나아라 ";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
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
          profilePictureUrl: '/img/logo.png',
          date: new Date(),
          content: generateRandomContent(1000),
        };
      });

      context.commit('clearFeed');

      feeds.forEach((feed) => {
        context.commit('addFeed', feed);
      });
    }
  },
});
