// 에디터는 어떤 기능이 들어가야 하는가?
//     1. 글 쓸 수 있어야 함.
//     2. 이모티콘 넣을 수 있어야 하고
//     3. 사진 넣을 수 있어야 하고요 - Optional
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import EmoteInputComponent from '@/components/EmoteInput.vue';
import { TWITCH_APP_CLIENT_ID } from '@/api/twitchApi';
import { savePost, editPost } from '@/api/backendApi';
import uploadMedia from '@/utils/uploadMedia';
import toJsonNodeFromHTMLElement from '@/JsonNode/toJsonNodeFromHTMLElement';
import { ExtensionAuth } from '@/store/twitch';
import { Feed } from '../../../types/FeedFile';
import toJsonNodeFromString from '@/JsonNode/toJsonNodeFromString';

declare var Twitch: any;

@Component({
  components: {
    EmoteInputComponent,
  },
})
export default class Edit extends Vue {
  @State('extensionAuth') extensionAuth!: ExtensionAuth;
  @State('editingFeed') editingFeed?: Feed;

  @Action('changePage') changePage: any;
  @Action('fetchEmotesAvailable') fetchEmotesAvailable: any;
  @Mutation('setETag') setETag: any;

  readonly PAGE_WIDTH = 500;
  readonly IMAGE_MARGIN = 10;

  $refs!: {
    editor: HTMLDivElement;
    imageFileInput: HTMLInputElement;
  };

  elementReplaceMap: Array<{ source: HTMLElement, dest: HTMLElement }> = [];
  compressingJobs: Array<Promise<any>> = [];
  mounted() {
    this.loadEditorContent();
  }
  loadEditorContent() {
    try {
      if (!this.editingFeed) {
        return;
      }
      const jsonNode = toJsonNodeFromString(this.editingFeed.content);
      this.$refs.editor.innerHTML = jsonNode.toHtmlString();
    } catch (err) {
      console.error(err);
      this.$refs.editor.innerText = 'ERROR - 이 글을 로딩할 수 없습니다.';
    }
  }
  back() {
    this.changePage('ViewPage');
  }
  async save() {
    await Promise.all(this.compressingJobs);

    this.replaceMediaIntoUploadAll();

    const jsonNode = toJsonNodeFromHTMLElement(this.$refs.editor);
    const content = JSON.stringify(jsonNode);

    try {
      const eTag = this.editingFeed
        ? await editPost(this.extensionAuth.token, content, this.editingFeed.id)
        : await savePost(this.extensionAuth.token, content);
      this.setETag(eTag);
      this.changePage('ViewPage');
    } catch (err) {
      alert(`다음과 같은 이유로 글을 저장하지 못하였습니다. - ${err}`);
    }
  }
  onClickEmote(emote: Emote) {
    const imageTag = document.createElement('img');
    imageTag.src = emote.url;
    imageTag.className = 'emote-image';

    this.addHtmlElement(imageTag);
  }
  onClickAddImageButton() {
    this.$refs.imageFileInput.click();
  }
  async onImageFileUpload(event: Event) {
    const files = this.$refs.imageFileInput.files;
    if (!files || !files[0]) {
      return;
    }

    const file = files[0];
    const tempUrl = URL.createObjectURL(file);

    const tempMediaElement = this.createMediaElement(tempUrl, file.type);

    const compressingJob = uploadMedia(this.extensionAuth.token, file);
    this.compressingJobs.push(compressingJob);

    compressingJob.then(({ url, mime }) => {
      const uploadedMediaElement = this.createMediaElement(url, mime);

      this.elementReplaceMap.push({
        source: tempMediaElement,
        dest: uploadedMediaElement,
      });
    });

    this.addHtmlElement(tempMediaElement);
  }
  createMediaElement(src, mime): HTMLElement {
    if (['image', 'video'].every((type) => !mime.startsWith(type))) {
      alert(`잘못된 파일 형식입니다(${mime}).`);
      throw new Error('uplload only image or video file please');
    }
    const mediaElement = mime.startsWith('image')
      ? this.createImageElement(src)
      : this.createVideoElement(src);

    return mediaElement;
  }
  createVideoElement(src): HTMLElement {
    const videoElement = document.createElement('video');
    videoElement.src = src;
    videoElement.loop = true;
    videoElement.autoplay = true;
    videoElement.className = 'uploaded-video';
    return videoElement;
  }
  createImageElement(src): HTMLElement {
    const imageElement = document.createElement('img');
    imageElement.src = src;
    imageElement.className = 'uploaded-image';
    return imageElement;
  }
  addHtmlElement(element: HTMLElement) {
    this.$refs.editor.focus();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    range.insertNode(element);
    range.setStartAfter(element);
    range.setEndAfter(element);

    this.$refs.editor.focus();
  }
  replaceMediaIntoUploadAll() {
    this.elementReplaceMap.forEach(({ source, dest }) => {
      const { parentNode } = source;
      if (!parentNode) {
        throw new Error(`no parent Node for ${source.innerHTML}`);
      }
      parentNode.replaceChild(dest, source);
    });
  }
}
