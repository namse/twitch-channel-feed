<template>
  <div class="container">
    <header>
      <span class="date">{{fromDateString}}</span>
    </header>
    <div class="content" v-html="htmlContent"></div>
    <div class="bottom-menu">
      <button class="edit" @click="startEditingFeed(feed)">
        <font-awesome-icon icon="edit" /> 수정하기
      </button>
      <button class="edit" @click="startEditingFeed(feed)">
        <font-awesome-icon icon="trash-alt" /> 삭제하기
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Action } from "vuex-class";
import toJsonNodeFromString from "../JsonNode/toJsonNodeFromString";
import { Feed } from '../../../types/FeedFile';
const moment = require('moment');

@Component
export default class FeedComponent extends Vue {
  @Prop() private feed!: Feed;
  @Action("startEditingFeed") startEditingFeed: any;

  htmlContent: string = '';

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

  readonly fromDateString: string = moment(this.feed.date).fromNow();
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  height: 100%;
  padding: 15px 0;
  margin: 0 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 12px;
  white-space: pre-line;
  overflow-wrap: break-word;
  border-bottom-color: hsla(0, 0%, 100%, 0.1);
}
.date {
  color: #b19dd8;
}
.content {
  overflow-wrap: break-word;
}
.bottom-menu {
  text-align: center;
}
</style>
