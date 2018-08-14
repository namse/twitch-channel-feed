import { Component, Vue } from 'vue-property-decorator';
import { getUser, getUserEmotes } from '../../client/src/api/twitchApi'
import { getEmotesinfo, saveEmotes } from '../../client/src/api/backendApi'

@Component
export default class App extends Vue {
  accessToken: string = '';
  idToken: string = '';

  async mounted() {
    this.fetchAccessTokenAndIdToken();
    const { accessToken, idToken } = this;

    const user = await getUser(this.accessToken);
    const { _id: userId } = user;

    const emoticonSets = await getUserEmotes(accessToken, userId);

    const emotesMapAvaialbleToUser: any = {};
    await Promise.all(Object.keys(emoticonSets).map(async emoteSetId => {
      // Access S3 bucket with emoteSetId
      const emotes = await getEmotesinfo(emoteSetId)
      emotesMapAvaialbleToUser[emoteSetId] = emotes;
    }));

    await saveEmotes(idToken, userId, emotesMapAvaialbleToUser);
    alert('정상적으로 저장되었습니다.');
  }
  extractData(keyValueStrings: string[], key: string): string {
    const data = keyValueStrings.find(keyValueString => keyValueString.indexOf(key) === 0);
    if (!data) {
      return '';
    }
    return data.substring(`${key}=`.length);
  }

  fetchAccessTokenAndIdToken() {
    if (window.location.hash.indexOf('access_token') < 0) {
      return;
    }
    const data = window.location.hash.replace('#', '').split('&');
    this.accessToken = this.extractData(data, 'access_token');
    this.idToken = this.extractData(data, 'id_token');
  }
}