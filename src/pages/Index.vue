<template>
  <q-page class="home-container">
    <div class="q-pa-md raid-card-page">
      <div class="row justify-evenly raid-card-row">
        <div v-for="(raid, index) in raids" :key="index" class="col-6 raid-card-col">
          <raid-card :img="raid.img_path" :id="raid.id" :name="raid.name" :path="raid.route" />
        </div>
        <div class="col-6 raid-card-col">
          <div class="oqs"></div>
        </div>
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
// .home-container::before {
//   content: '';
//   background: url('~assets/home-background.jpg') center center no-repeat;
//   background-size: cover;
//   position: absolute;
//   z-index: -1;
//   width: 100%;
//   height: 100%;
//   overflow: hidden;
// }

.raid-card-page {
  display: flex;
  justify-content: center;
}

.raid-card-row {
  display: flex;
  align-items: center;
  width: 540px;

  .oqs {
    background: url('~assets/oqs.jpg') center center no-repeat;
    background-size: cover;
    width: 220px;
    height: 223px;
  }
}

.raid-card-col {
  display: flex;
  justify-content: center;

  &:nth-of-type(n + 3) {
    margin-top: 20px;
  }
}

.version {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
