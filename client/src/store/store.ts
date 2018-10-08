import Vue from 'vue';
import Vuex from 'vuex';
import { getUserEmotes, getUser, getProfilePicture, getUsername } from '@/api/twitchApi';
import { getRecentFeedFile, getFeedFile } from '@/api/awsApi';
import { getEmotesAvailable } from '@/api/backendApi';
import { TwitchUser, EmoticonSets, ExtensionAuth } from '@/store/twitch';
import { Feed, FeedFile } from '../../../types/FeedFile';

Vue.use(Vuex);

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
  currentFeedFile?: FeedFile;
  userId?: string;
  eTag?: string;
  editingFeed?: Feed;
}

const initialState: State = {
  feeds: [],
  accessToken: undefined,
  idToken: undefined,
  user: undefined,
  emoticonSets: undefined,
  extensionAuth: undefined,
  currentPage: 'ViewPage',
  isOwner: false,
  emotesMap: {},
  currentFeedFile: undefined,
  userId: undefined,
  eTag: undefined,
  editingFeed: undefined,
};

export default new Vuex.Store({
  state: initialState,
  mutations: {
    clearFeed(state) {
      state.feeds = [];
      state.currentFeedFile = undefined;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setIdToken(state, idToken) {
      state.idToken = idToken;
    },
    setUser(state, user) {
      state.user = user;
    },
    setUserEmote(state, user) {
      state.user = user;
    },
    setEmoticonSets(state, emoticonSets) {
      state.emoticonSets = emoticonSets;
    },
    setExtensionAuth(state, extensionAuth: ExtensionAuth) {
      state.extensionAuth = extensionAuth;
      state.userId = extensionAuth.channelId;
    },
    setIsOwner(state, isOwner) {
      state.isOwner = isOwner;
    },
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    setEmotesAvailable(state, emotesMap) {
      state.emotesMap = emotesMap;
    },
    addFeedFile(state, feedFile: FeedFile) {
      state.feeds.push(...feedFile.feeds);
      state.currentFeedFile = feedFile;
      console.log(feedFile.nextData);
    },
    clearETag(state) {
      state.eTag = undefined;
    },
    setETag(state, eTag: string) {
      state.eTag = eTag;
    },
  },
  actions: {
    async loadRecentFeeds(context) {
      const {
        userId,
        eTag,
      } = context.state;
      if (!userId) {
        throw new Error('no userId');
      }
      const feedFile = await getRecentFeedFile(userId, eTag);
      context.commit('clearETag');
      context.commit('clearFeed');
      context.commit('addFeedFile', feedFile);
    },
    async loadNextFeeds(context) {
      const {
        currentFeedFile,
        userId,
      } = context.state;
      if (!currentFeedFile) {
        throw new Error('no currentFeedFile');
      }
      if (!currentFeedFile.nextData) {
        throw new Error('no currentFeedFile.nextData');
      }
      if (!userId) {
        throw new Error('no userId');
      }
      const feedFile = await getFeedFile(currentFeedFile.nextData);
      context.commit('addFeedFile', feedFile);
    },
    async saveExtensionAuth(context, auth: ExtensionAuth) {
      context.commit('setExtensionAuth', auth);

      await context.dispatch('loadRecentFeeds');

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
        await context.dispatch('loadRecentFeeds');
      }
    },
    async fetchEmotesAvailable(context, userId) {
      const emotesAvailable = await getEmotesAvailable(userId);
      context.commit('setEmotesAvailable', emotesAvailable);
    },
    async startEditingFeed(context, feed) {
      context.state.editingFeed = feed;
      context.commit('setCurrentPage', 'EditPage');
    },
  },
});
