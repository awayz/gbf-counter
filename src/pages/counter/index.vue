<template>
  <q-page>
    <div class="row justify-center">
      <div class="drop-col">
        <drop-item-card
          class="drop-item"
          v-for="(drop, index) in drops"
          :key="index"
          :img="drop.imgPath"
          :itemId="drop.id"
          :itemCount="itemCount[drop.id]"
          :raidId="raidId"
          @save="saveCount"
        ></drop-item-card>
      </div>
    </div>
    <div class="back-container">
      <div class="total">
        <span class="title">总计</span>
        <span class="num">{{ total }} </span>
      </div>
      <q-btn flat size="12px" color="primary" icon="arrow_back" @click="handle"></q-btn>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import DropItemCard from 'src/components/DropItemCard.vue';
import { DropItems, DropItemMap, DropItemI } from 'src/constants/drop';

export default defineComponent({
  name: 'CounterPage',
  components: {
    DropItemCard,
  },
  setup() {
    const route = useRoute();
    const raidId: string = route.params.id as string;

    const dropItems: string[] = DropItemMap[raidId];
    const drops: DropItemI[] = [];
    for (let i = 0; i < dropItems.length; i += 1) {
      const dropItem: string = dropItems[i];
      drops.push(DropItems[dropItem]);
    }

    const itemCount = reactive<Record<string, number>>({});
    onMounted(async () => {
      const t = (await (window as any).api.statistics(raidId)) as Record<string, number>;
      Object.assign(itemCount, t);
    });

    const total = ref(0);
    watch(itemCount, (cur: Record<string, number>) => {
      let t = 0;
      for (let i = 0; i < drops.length; i += 1) {
        t += cur[drops[i].id];
      }
      total.value = t;
    });

    return {
      drops,
      itemCount,
      raidId,
      total,
    };
  },

  data() {
    return {};
  },
  methods: {
    handle() {
      (window as any).api.endCount();
      void this.$router.push({ path: '/' });
    },
    saveCount(value: any) {
      this.itemCount[value.itemId] = value.num as number;
    },
  },
});
</script>
<style lang="scss" scoped>
.drop-col {
  width: 174px;
  height: 100%;
}
.back-container {
  height: 30px;
  display: flex;
  align-items: center;

  .total {
    width: 70%;

    .title {
      font-size: 16px;
      margin: 0 0 0 10px;
    }
    .num {
      font-size: 14px;
      margin-left: 7px;
    }
  }
}
</style>
