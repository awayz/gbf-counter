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
import { RaidList } from 'src/constants/drop';

export default defineComponent({
  name: 'PageIndex',
  components: {
    RaidCard,
  },

  setup() {
    return {
      raids: RaidList,
    };
  },
});
</script>

<style lang="scss" scoped></style>
