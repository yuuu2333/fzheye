<template>
<div class="talk">
    <button @click="addTalk">获取一句土味情话</button>
    <ul>
      <li v-for="talk in talkStore.TalkList" :key="talk.id">{{talk.title}}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import axios from 'axios'
import { nanoid } from "nanoid";
import { useTalkStore } from '@/store/loveTalk';

const talkStore = useTalkStore()
function addTalk() {
  talkStore.getLoveTalk()
}

</script>
<style scoped>
.talk {
  margin-top: 20px;
    background-color: orange;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px;
  }
</style>
