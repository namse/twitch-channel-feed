import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import toJsonNodeFromString from '@/JsonNode/toJsonNodeFromString';
import { Feed } from '../../../types/FeedFile';
import ModalComponent from '@/components/Modal.vue';
import moment from 'moment-timezone';
import { deletePost } from '@/api/backendApi';
import { State } from 'vuex-class';
import { ExtensionAuth } from '@/store/twitch';

moment.tz.setDefault('Asia/Seoul');
moment.locale('ko');

@Component({
  components: {
    ModalComponent,
  },
})
export default class FeedComponent extends Vue {
  @Prop() feed!: Feed;
  @Action('startEditingFeed') startEditingFeed: any;
  @Action('loadRecentFeeds') loadRecentFeeds: any;
  @State('extensionAuth') extensionAuth!: ExtensionAuth;
  @State('isOwner') isOwner!: boolean;

  htmlContent: string = '';
  isOpenDeleteModal: boolean = false;
  readonly fromDateString: string = moment(this.feed.date).fromNow();

  @Watch('feed.content', { immediate: true })
  onFeedContentChanged(val: string, oldVal: string) {
    try {
      const jsonNode = toJsonNodeFromString(val);
      this.htmlContent = jsonNode.toHtmlString();
    } catch (err) {
      console.error(err);
      this.htmlContent = 'ERROR - 이 글을 로딩할 수 없습니다.';
    }
  }

  openDeleteFeedModal() {
    this.isOpenDeleteModal = true;
  }
  async onConfirmDelete(feed: Feed) {
    console.log('onConfirmDelete');
    console.log(feed.id);
    await deletePost(this.extensionAuth.token, feed.id);
    this.isOpenDeleteModal = false; // TODO: Should I close this here? Why not inside of Modal.ts?
    this.loadRecentFeeds();
  }
  closeDeleteModal() {
    this.isOpenDeleteModal = false;
  }
}
