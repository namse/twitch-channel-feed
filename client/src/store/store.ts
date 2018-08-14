import Vue from 'vue';
import Vuex from 'vuex';
import uuid from 'uuid/v4';
import { getUserEmotes, getUser, getProfilePicture, getUsername } from '@/api/twitchApi';
import { getFeeds } from '@/api/awsApi';
import { getEmotesAvailable } from '@/api/backendApi';

Vue.use(Vuex);

function generateRandomContent(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789가나다라마바사아아아라나나다라마나아라 ";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

interface State {
  feeds: Feed[];
  accessToken?: string;
  idToken?: string;
  user?: TwitchUser;
  emoticonSets?: EmoticonSets;
  extensionAuth?: ExtensionAuth;
  currentPage: string;
  isOwner: boolean;
  emotesMap: EmotesMap;
};

const state: State = {
  feeds: [],
  accessToken: undefined,
  idToken: undefined,
  user: undefined,
  emoticonSets: undefined,
  extensionAuth: undefined,
  currentPage: 'ViewPage',
  isOwner: false,
  emotesMap: {},
};

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
    setExtensionAuth(state, extensionAuth) {
      state.extensionAuth = extensionAuth;
    },
    setIsOwner(state, isOwner) {
      state.isOwner = isOwner;
    },
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    setEmotesAvailable(state, emotesMap) {
      state.emotesMap = emotesMap;
    }
  },
  actions: {
    async loadFeeds(context, userId) {
      const {
      } = context.state;
      const feeds = await getFeeds(userId);
      context.commit('clearFeed');

      feeds.forEach((feed) => {
        context.commit('addFeed', feed);
      });
    },
    async fetchUser(context) {
      const {
        accessToken,
      } = context.state;
      if (!accessToken) {
        throw new Error('No Access Token');
      }
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
      if (!accessToken) {
        throw new Error('No Access Token');
      }
      const emoticonSets = await getUserEmotes(accessToken, user._id);
      context.commit('setEmoticonSets', emoticonSets);
    },
    setAccessToken(context, accessToken) {
      context.commit('setAccessToken', accessToken);
    },
    async saveExtensionAuth(context, auth: ExtensionAuth) {
      context.commit('setExtensionAuth', auth);

      await context.dispatch('loadFeeds', auth.channelId);

      context.dispatch('checkWhetherOwner');
      if (context.state.isOwner) {
        await context.dispatch('fetchEmotesAvailable', auth.channelId);
      }
    },
    checkWhetherOwner(context) {
      const {
        extensionAuth,
      } = context.state;

      if (!extensionAuth) {
        context.commit('setIsOwner', false);
        return;
      }
      const payload = JSON.parse(atob(extensionAuth.token.split('.')[1]));
      const isOwner = payload.role === 'broadcaster';

      context.commit('setIsOwner', isOwner);
    },
    async changePage(context, pageName) {
      context.commit('setCurrentPage', pageName);
      if (pageName === 'ViewPage' && context.state.extensionAuth) {
        await context.dispatch('loadFeeds', context.state.extensionAuth.channelId);
      }
    },
    async fetchEmotesAvailable(context, userId) {
      const emotesAvailable = await getEmotesAvailable(userId);
      context.commit('setEmotesAvailable', emotesAvailable);
    },
  },
});
