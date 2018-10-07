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

<script lang="ts" src="./View.ts">

</script>

<style>
.view {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
