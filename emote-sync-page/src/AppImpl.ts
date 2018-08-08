import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import { getUser, getUserEmotes } from '../../client/src/api/twitchApi'

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  accessToken: string = '';
  idToken: string = '';

  async mounted() {
    this.fetchAccessTokenAndIdToken();
    const user = await getUser(this.accessToken);
    console.log(user);
    const emotes = await getUserEmotes(this.accessToken, user._id);
    console.log(emotes);
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