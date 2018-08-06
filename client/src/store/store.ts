import Vue from 'vue';
import Vuex from 'vuex';
import uuid from 'uuid/v4';
import { getUserEmotes, getUser, getProfilePicture, getUsername } from '@/api/twitchApi';
import { getFeedContents } from '@/api/awsApi';

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
  accessToken?: string;
  idToken?: string;
  user?: TwitchUser;
  emoticonSets?: EmoticonSets;
};

const state: State = {
  feeds: [],
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
    async loadingFeeds(context, userId) {
      const {
      } = context.state;
      const feedContents = await getFeedContents(userId);
      const profilePictureUrl = await getProfilePicture(userId);
      const username = await getUsername(userId);

      // TODO : check empty feed
      const feeds: Feed[] = feedContents.map((content) => {
        return {
          id: uuid(),
          username,
          profilePictureUrl,
          date: new Date(), // TODO
          content,
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
    },
    async fetchUser(context) {
      const {
        accessToken,
      } = context.state;
      const user = await getUser(accessToken);
      context.commit('setUser', user);
    },
    async fetchUserEmotes(context) {
      const {
        accessToken,
        user,
      } = context.state;
      if (!user) {
        throw new Error('No Twitch User logined');
      }
      const emoticonSets = await getUserEmotes(accessToken, user._id);
      context.commit('setEmoticonSets', emoticonSets);
    },
    setAccessToken(context, accessToken) {
      context.commit('setAccessToken', accessToken);
    }
  },
});
