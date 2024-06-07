<script setup>
    import Sidebar from "@/components/Sidebar.vue";
    import { useSettingsStore } from '../stores/settingsStore';

    const settingsStore = useSettingsStore();
</script>

<template>
    <main class="relative h-dvh text-slate-300 overflow-x-hidden">
        <div class="background" :style="'background: linear-gradient(to bottom right,' + settingsStore.getPrimaryColorInRGBA + ', ' + settingsStore.getSecondaryColorInRGBA + ')'"></div>
        <div class="content">
            <Sidebar />
            <slot></slot>
        </div>
    </main>
</template>

<style scoped>
.content {
    position: relative;
    z-index: 1;
}

.background {
    position: fixed;
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