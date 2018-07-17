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
import { mapActions } from "vuex";
import { State, Action, Getter } from "vuex-class";
import { Feed } from "@/store";

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
