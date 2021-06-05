<template>
  <q-card class="drop-card">
    <q-btn @click="add" size="xs" dense flat>
      <q-avatar square size="46px">
        <img :src="img" />
      </q-avatar>
    </q-btn>

    <digit-animation-group
      class="drop-counter"
      type="wheel"
      size="16px"
      format="0,0"
      use-ease="Quit.easeInOut"
      :digits="count"
      :duration="300"
    />
    <div style="width: 20px">
      <q-btn size="10px" color="primary" dense flat icon="add" @click="add" />
      <q-btn size="10px" color="negative" dense flat icon="remove" @click="subtract" />
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { DigitAnimationGroup } from 'vue-digit-animation';

export default defineComponent({
  name: 'DropItemCard',
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    DigitAnimationGroup,
  },
  props: {
    img: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
      default: 0,
    },
    itemName: {
      type: String,
      required: true,
    },
    raidId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const count = ref(0);
    watch(
      () => props.itemCount,
      (cur) => {
        count.value = cur;
      },
    );

    return {
      count,
    };
  },
  methods: {
    async add() {
      this.count += 1;
      await (window as any).api.save({ raidId: this.raidId, itemId: this.itemId, num: this.count });
      await (window as any).api.increment({ raidId: this.raidId, itemId: this.itemId, itemName: this.itemName });
      this.$emit('save', { itemId: this.itemId, num: this.count });
    },
    async subtract() {
      if (this.count <= 0) {
        return;
      }
      this.count -= 1;
      await (window as any).api.save({ raidId: this.raidId, itemId: this.itemId, num: this.count });
      await (window as any).api.decrement({ raidId: this.raidId, itemId: this.itemId });
      this.$emit('save', { itemId: this.itemId, num: this.count });
    },
  },
});
</script>

<style lang="scss" scoped>
.drop-card {
  width: 100%;
  height: 60px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 3px 0 3px 0;

  .drop-counter {
    display: flex;
    justify-content: center;
    width: 100px;
  }
}
</style>
