<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="my-header shadow-1" elevated>
      <q-bar>
        <div class="toolbar-title">金来！</div>
        <q-space />
        <q-btn flat round dense icon="push_pin" @click="changeOnTop" />
        <q-btn flat round dense icon="minimize" @click="minimize" />
        <q-btn flat round dense icon="close" @click="close" />
      </q-bar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BlankLayout',

  setup() {
    return {};
  },

  methods: {
    minimize() {
      (window as any).api.minimize();
    },

    close() {
      (window as any).api.close();
    },

    changeOnTop() {
      (window as any).api.changeOnTop();
    },
  },
});
</script>
<style lang="scss" scoped>
.my-header {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
  height: 30px;

  :deep(.q-btn) {
    -webkit-app-region: no-drag;
  }

  .toolbar-title {
    font-size: 14px;
  }
}
</style>
