import { Component, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import ViewPage from '@/pages/View.vue';
import EditPage from '@/pages/Edit.vue';

declare var Twitch: any;

@Component({
  components: {
    ViewPage,
    EditPage,
  },
})
export default class App extends Vue {
  @Action('saveExtensionAuth') saveExtensionAuth: any;

  @State('currentPage') currentPage!: string;

  created() {
    if (process.env.NODE_ENV !== 'production') {
      console.log(process.env.NODE_ENV);
    }
    Twitch.ext.onAuthorized(auth => {
      this.saveExtensionAuth(auth);
    });
  }
}
