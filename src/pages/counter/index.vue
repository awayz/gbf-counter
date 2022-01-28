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
          :itemName="drop.name"
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
    <div class="switch-container">
      <span v-for="(raid, index) in raids" :key="index">
        <q-btn
          flat
          size="12px"
          class="switch-btn"
          v-if="raid.id !== this.raidId"
          @click="handleSwitch(raid.id, raid.route)"
        >
          {{ raid.name }}
        </q-btn>
      </span>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import DropItemCard from 'src/components/DropItemCard.vue';
import { DropItems, DropItemMap, DropItemI, RaidList } from 'src/constants/drop';

export default defineComponent({
  name: 'CounterPage',
  components: {
    DropItemCard,
  },
  setup() {
    const route = useRoute();
    const raidId: string = route.params.id as string;
    // 对应 raid 的所有掉落物品的 id
    const dropItems: string[] = DropItemMap[raidId];
    // 对应 raid 的所有掉落物品的详细信息
    const drops: DropItemI[] = [];
    for (let i = 0; i < dropItems.length; i += 1) {
      const dropItem: string = dropItems[i];
      drops.push(DropItems[dropItem]);
    }

    // 每个掉落物品的计数
    const itemCount = reactive<Record<string, number>>({});
    onMounted(async () => {
      const t = (await (window as any).api.count(raidId)) as Record<string, number>;
      Object.assign(itemCount, t);
    });

    const total = ref(0);
    watch(itemCount, (cur: Record<string, number>) => {
      let t = 0;
      for (let i = 0; i < drops.length; i += 1) {
        // 新添加掉落之后，老的记录里可能没有这个掉落信息，所以加了个判断
        t += cur[drops[i].id] ?? 0;
      }
      total.value = t;
    });

    return {
      drops,
      itemCount,
      raidId,
      total,
      raids: RaidList,
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
    handleSwitch(id: string, path: string) {
      const dropIdxs: string[] = DropItemMap[id];
      const height = dropIdxs.length * 63 + 93;
      (window as any).api.startCount(height);
      void this.$router.push({ path });
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
.switch-container {
  display: flex;
  justify-content: space-around;
}
</style>
