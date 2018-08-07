<template>
  <div class="view">
    <button
      v-if="isOwner"
      v-on:click="changePage('EditPage')"
    >Post New Channel Feed</button>
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
  @Action("changePage") changePage: any;

  @State("feeds") feeds!: Feed[];
  @State("isOwner") isOwner!: boolean;

  // $route!: Route;
  twitch: any = Twitch;
  userId: string = "";
  channelId: string = "";
}
</script>
