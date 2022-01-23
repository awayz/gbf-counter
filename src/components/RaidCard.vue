<template>
  <q-card class="my-card shadow-10">
    <q-img :src="img" class="battle-target-img">
      <div class="absolute-bottom text-right">{{ name }}</div>
    </q-img>
    <q-separator />
    <q-card-actions align="right">
      <q-btn outline color="teal" @click="handleEdit">修改</q-btn>
      <q-btn color="primary" class="start-btn" @click="handleStart">开始</q-btn>
    </q-card-actions>
  </q-card>

  <q-dialog
    v-model="showEdit"
    transition-show="slide-right"
    transition-hide="slide-left"
    full-height
    :position="editPosition"
  >
    <q-card style="height: 100%; width: 300px">
      <q-card-section>
        <div class="text-h6">{{ name }}</div>
      </q-card-section>

      <q-card-section>
        <q-scroll-area style="height: 350px; width: 100%; background-color: #ffffff" :thumb-style="thumbStyle">
          <q-form class="q-gutter-md row justify-center">
            <q-input
              :key="item.id"
              type="number"
              v-for="(item, idx) in edit.itemCount"
              outlined
              style="width: 210px"
              v-model.number="edit.itemCount[idx].count"
              :rules="[(val:any) => validCount(val) || '请输入正整数']"
              :label="item.name"
            />
          </q-form>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="取消" v-close-popup />
        <q-btn color="primary" label="确定" v-close-popup @click="saveDrop" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DropItemMap, DropItems } from 'src/constants/drop';
import { useQuasar } from 'quasar';

interface DropInfoI {
  id: string;
  name: string;
  count: number;
}

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
  setup() {
    const $q = useQuasar();
    return {
      showEdit: ref(false),
      editPosition: ref('left'),
      $q,

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#55CD85',
        width: '5px',
        opacity: 0.75,
      },
    };
  },
  data() {
    return {
      edit: {
        itemCount: ref<DropInfoI[]>([]),
      },
    };
  },
  methods: {
    validCount(count: any) {
      if (!count && typeof count !== 'number') {
        return false;
      }
      console.log('validate count: ', count);
      return Number.isInteger(count) && count >= 0;
    },
    handleStart() {
      const dropIdxs: string[] = DropItemMap[this.id];
      const height = dropIdxs.length * 63 + 93;
      (window as any).api.startCount(height);
      void this.$router.push({ path: this.path });
    },
    async handleEdit() {
      this.showEdit = true;

      const raidId = this.id;
      const drops = (await (window as any).api.count(raidId)) as Record<string, number>;

      // 对应 raid 的所有掉落物品的 id
      const dropItems: string[] = DropItemMap[raidId];
      // 对应 raid 的所有掉落物品的详细信息
      this.edit.itemCount = [];

      for (let i = 0; i < dropItems.length; i += 1) {
        const dropItem: string = dropItems[i];
        let count = 0;
        if (Object.prototype.hasOwnProperty.call(drops, dropItem)) {
          count = Number(drops[dropItem]);
        }
        this.edit.itemCount.push({
          id: DropItems[dropItem].id,
          name: DropItems[dropItem].name,
          count,
        });
      }
    },

    async saveDrop() {
      const drops = this.edit.itemCount;
      const raidData: Record<string, number> = {};
      for (let i = 0; i < drops.length; i += 1) {
        const drop = drops[i];
        raidData[drop.id] = drop.count;
      }
      const result = (await (window as any).api.saveRaid({ raidId: this.id, raidData })) as boolean;

      if (result) {
        this.$q.notify({
          type: 'positive',
          message: '保存成功',
          position: 'top',
          timeout: 500,
        });
      } else {
        this.$q.notify({
          type: 'warning',
          message: '保存失败',
          position: 'top',
          timeout: 500,
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.start-btn {
  width: 140px;
}
.my-card {
  width: 220px;
}

.battle-target-img {
  height: 170px;
}
</style>
