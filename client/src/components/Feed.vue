<template>
  <div class="container">
    <ModalComponent
      title="피드 삭제"
      message="정말 피드를 삭제하시겠습니까?"
      :isOpen="isOpenDeleteModal"
      @confirm="onConfirmDelete(feed)"
      @cancel="closeDeleteModal()"
    />
    <header>
      <span class="date">{{fromDateString}}</span>
    </header>
    <div class="content" v-html="htmlContent"></div>
    <div v-if="isOwner" class="bottom-menu">
      <button class="edit" @click="startEditingFeed(feed)">
        <font-awesome-icon icon="edit" /> 수정하기
      </button>
      <button class="edit" @click="openDeleteFeedModal()">
        <font-awesome-icon icon="trash-alt" /> 삭제하기
      </button>
    </div>
  </div>
</template>

<script lang="ts" src="./Feed.ts">
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
