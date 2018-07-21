<template>
  <div class="view">
    <div v-for="feed in feeds" :key="feed.id">
      <FeedComponent :feed="feed"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FeedComponent from "@/components/Feed.vue";
import { State, Action } from "vuex-class";
import { Route } from "vue-router";

@Component({
  components: {
    FeedComponent
  }
})
export default class View extends Vue {
  @Action("loadingFeeds") loadingFeeds: any;
  @State("feeds") feeds!: Feed[];

  $route!: Route;

  created() {
    this.loadingFeeds(this.$route.params.userId);
  }
}
</script>
