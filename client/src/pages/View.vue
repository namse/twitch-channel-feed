<template>
  <div class="view">
    {{userId}}
    {{channelId}}
    <div v-for="feed in feeds" :key="feed.id">
      <FeedComponent :feed="feed"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FeedComponent from "@/components/Feed.vue";
import { State, Action } from "vuex-class";

declare var Twitch: any;

@Component({
  components: {
    FeedComponent
  }
})
export default class ViewPage extends Vue {
  @Action("loadingFeeds") loadingFeeds: any;
  @State("feeds") feeds!: Feed[];

  // $route!: Route;
  twitch: any = Twitch;
  userId: string = "";
  channelId: string = "";

  created() {
    Twitch.ext.onAuthorized(auth => {
      console.log(auth);
      this.userId = auth.userId;
      this.channelId = auth.channelId;
      this.loadingFeeds(auth.channelId);
    });
  }
}
</script>
