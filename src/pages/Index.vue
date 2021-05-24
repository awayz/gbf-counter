<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row justify-evenly">
        <raid-card
          class="col-4"
          v-for="(raid, index) in raids"
          :key="index"
          :img="raid.img_path"
          :id="raid.id"
          :name="raid.name"
          :path="raid.route"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RaidCard from 'src/components/RaidCard.vue';

const raidList = [
  {
    id: 'proto_bahamut',
    name: '大巴',
    img_path: 'statics/proto_bahamut.png',
    route: '/counter/proto_bahamut',
  },
  {
    id: 'akasha',
    name: '阿卡夏',
    img_path: 'statics/akasha.png',
    route: '/counter/akasha',
  },
];

export default defineComponent({
  name: 'PageIndex',
  components: {
    RaidCard,
  },

  setup() {
    return {
      raids: raidList,
    };
  },
});
</script>

<style lang="scss" scoped></style>
