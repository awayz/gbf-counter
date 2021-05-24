<template>
  <q-card class="my-card">
    <q-img :src="img" class="battle-target-img">
      <div class="text-h5 absolute-bottom text-right">{{ name }}</div>
    </q-img>
    <q-separator />
    <q-card-actions align="right">
      <q-btn color="primary" class="start-btn" @click="handleStart">开始</q-btn>
      <!-- <q-btn class="statistics">统计</q-btn> -->
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DropItemMap } from 'src/constants/drop';

export default defineComponent({
  name: 'RaidCard',
  props: {
    img: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleStart() {
      const dropIdxs: string[] = DropItemMap[this.id];
      const height = dropIdxs.length * 63 + 63;
      (window as any).api.startCount(height);
      void this.$router.push({ path: this.path });
    },
  },
});
</script>

<style lang="scss" scoped>
.start-btn {
  width: 140px;
}
.statistics {
  background: #ff0080;
  color: white;
  width: 80px;
}
.my-card {
  min-width: 300px;
  max-width: 350px;
  margin: 20px 0 20px 0;
}
.battle-target-img {
  height: 250px;
}
</style>
