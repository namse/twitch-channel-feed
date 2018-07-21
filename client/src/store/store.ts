import Vue from 'vue';
import Vuex from 'vuex';
import uuid from 'uuid/v4';

Vue.use(Vuex);

function generateRandomContent(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789가나다라마바사아아아라나나다라마나아라 ";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function extractData(keyValueStrings: string[], key: string): string {
  const data = keyValueStrings.find(keyValueString => keyValueString.indexOf(key) === 0);
  if (!data) {
    return '';
  }
  return data.substring(`${key}=`.length);
}

interface State {
  feeds: Feed[];
  clientId: string;
  accessToken?: string;
  idToken?: string;
  user?: TwitchUser;
  emoticonSets?: EmoticonSets;
};

const state: State = {
  feeds: [],
  clientId: 'nmbqgdv3qbinn9z3088sw816t834jx',
  accessToken: undefined,
  idToken: undefined,
  user: undefined,
  emoticonSets: undefined,
}

export default new Vuex.Store({
  state,
  mutations: {
    addFeed(state, feed) {
      state.feeds.push(feed);
    },
    clearFeed(state) {
      state.feeds = [];
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setIdToken(state, idToken) {
      state.idToken = idToken;
    },
    setUser(state, user) {
      state.user = user
    },
    setUserEmote(state, user) {
      state.user = user
    },
    setEmoticonSets(state, emoticonSets) {
      state.emoticonSets = emoticonSets;
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
    },
    fetchAccessTokenAndIdToken(context) {
      if (window.location.hash.indexOf('access_token') < 0) {
        return;
      }
      const data = window.location.hash.replace('#', '').split('&');
      const accessToken = extractData(data, 'access_token');
      const idToken = extractData(data, 'id_token');

      context.commit('setAccessToken', accessToken);
      context.commit('setIdToken', idToken);
      fetch('https://yaauic5zfh.execute-api.ap-northeast-2.amazonaws.com/dev/feed', {
        method: 'POST',
        body: JSON.stringify({
          token: idToken,
        }),
      }).then((response) => response.json())
        .then((json) => console.log(json));
    },
    async fetchUser(context) {
      const response = await fetch('https://api.twitch.tv/kraken/user', {
        headers: {
          'Authorization': `OAuth ${this.accessToken}`,
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': context.state.clientId,
        },
      });
      const json = await response.json();
      context.commit('setUser', json);
    },
    async fetchUserEmotes(context) {
      let user = context.state.user;
      if (!user) {
        throw new Error('No Twitch User logined');
      }
      const response = await fetch(`https://api.twitch.tv/kraken/users/${user._id}/emotes`, {
        headers: {
          'Authorization': `OAuth ${this.accessToken}`,
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': context.state.clientId,
        }
      });
      const json = await response.json();
      context.commit('setEmoticonSets', json.emoticon_sets);
    },
  },
});
