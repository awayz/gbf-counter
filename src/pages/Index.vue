<template>
  <q-page class="home-container">
    <div class="q-pa-md">
      <div class="row justify-end q-gutter-lg raid-card-row">
        <raid-card
          v-for="(raid, index) in raids"
          :key="index"
          :img="raid.img_path"
          :id="raid.id"
          :name="raid.name"
          :path="raid.route"
        />
      </div>
      <q-badge outline color="primary" class="version">{{ `version ${version}` }}</q-badge>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import RaidCard from 'src/components/RaidCard.vue';
import { RaidList } from 'src/constants/drop';

export default defineComponent({
  name: 'PageIndex',
  components: {
    RaidCard,
  },

  setup() {
    const version = ref('');
    onMounted(async () => {
      version.value = (await (window as any).api.version()) as string;
    });
    return {
      raids: RaidList,
      version,
    };
  },
});
</script>

<style lang="scss" scoped>
.home-container::before {
  content: '';
  background: url('~assets/home-background.jpg') center center no-repeat;
  background-size: cover;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.raid-card-row {
  margin-top: 50px;
  padding: 0 20px 0 0;
}

.version {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
