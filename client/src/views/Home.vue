<template>
  <div class="home">
    <div v-for="feed in feeds" :key="feed.id">
      <FeedComponent :feed="feed"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FeedComponent from "@/components/Feed.vue";
import { State, Action } from "vuex-class";

@Component({
  components: {
    FeedComponent
  }
})
export default class Home extends Vue {
  @Action("loadingFeeds") loadingFeeds: any;
  @State("feeds") feeds!: Feed[];

  created() {
    this.loadingFeeds();
  }
}
</script>
