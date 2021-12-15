<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import dummyModule from "@/store/modules/dummy";

export default {
  name: "AppAbout",
  created() {
    // mannually registering a module
    this.$store.registerModule("dummyModule", dummyModule);
  }
};
</script>
