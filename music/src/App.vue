<template>
  <app-header />
  <!-- this is like props.children -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
  <!-- Player -->
  <app-player />
  <auth-modal />
</template>

<script>
import AppHeader from "@/components/Header.vue";
import AuthModal from "@/components/Auth.vue";
import AppPlayer from "@/components/Player";

export default {
  name: "App",
  components: {
    AppHeader,
    AuthModal,
    AppPlayer,
  },
  created() {
    this.$store.dispatch("initLogin");
  },
};
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
