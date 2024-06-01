<script setup>
    import Sidebar from "@/components/Sidebar.vue";
    import { useSettingsStore } from '../stores/settingsStore';

    const settingsStore = useSettingsStore();

    // TODO: overlapping background is a problem
</script>

<template>
    <main class="wrapper relative h-dvh overflow-hidden text-slate-300 bg-zinc-800">
        <Sidebar />
        <div class="background" :style="'background: linear-gradient(to bottom right,' + settingsStore.getPrimaryColorInRGBA + ', ' + settingsStore.getSecondaryColorInRGBA + ')'"></div>
        <slot></slot>
    </main>
</template>

<style scoped>
.background {
  position: absolute;
  top: 10%;
  left: 0;
  width: 130%;
  height: 200px;
  z-index: 0;
  filter: blur(80px);
  border-radius: 70%;
  transform: rotate(15deg) translate(-15%);
}
</style>