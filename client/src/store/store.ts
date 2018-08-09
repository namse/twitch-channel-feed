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

interface State {
  feeds: Feed[];
  accessToken?: string;
  idToken?: string;
  user?: TwitchUser;
  emoticonSets?: EmoticonSets;
  extensionAuth?: ExtensionAuth;
  currentPage: string;
  isOwner: boolean;
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
      await context.dispatch('loadingFeeds', auth.channelId);
      context.dispatch('checkWhetherOwner');
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
    changePage(context, pageName) {
      context.commit('setCurrentPage', pageName);
    },
  },
});
