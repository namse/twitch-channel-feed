<template>
  <div ref="view" class="view">
    <button
      v-if="isOwner"
      v-on:click="startEditingFeed()"
    >Post New Channel Feed</button>
    <div v-for="(feed, index) in feeds" :key="index">
      <FeedComponent :feed="feed"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FeedComponent from "@/components/Feed.vue";
import { State, Action } from "vuex-class";
import { clearInterval } from "timers";
import { Feed, FeedFile } from '../../../types/FeedFile';

@Component({
  components: {
    FeedComponent
  }
})
export default class ViewPage extends Vue {
  @Action("startEditingFeed") startEditingFeed: any;
  @Action("loadNextFeeds") loadNextFeeds: any;

  @State("feeds") feeds!: Feed[];
  @State("currentFeedFile") currentFeedFile!: FeedFile;
  @State("isOwner") isOwner!: boolean;

  $refs!: {
    view: HTMLDivElement;
  };

  timer;

  mounted() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      const { view } = this.$refs;
      if (!view) {
        return;
      }
      const { scrollTop, offsetHeight, scrollHeight } = view;
      const needFetchNext = scrollTop >= scrollHeight - offsetHeight - 150;
      if (needFetchNext && this.currentFeedFile && this.currentFeedFile.nextData) {
        this.loadNextFeeds();
      }
    }, 1000);
  }
}
</script>
<style>
.view {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
