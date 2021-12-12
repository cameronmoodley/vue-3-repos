<template lang="">
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :add-song="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <app-composition-item
              v-for="(song, i) in songs"
              :key="song.docId"
              :song="song"
              :update-song="updateSong"
              :index="i"
              :remove-song="removeSong"
              :updated-unsaved-flag="updatedUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppUpload from "@/components/Upload";
import AppCompositionItem from "@/components/CompositionItem";
import { auth, songsCollection } from "@/includes/firebase";
export default {
  name: "AppManage",
  components: { AppUpload, AppCompositionItem },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm("You have unsaved changes are you sure you want to leave");
      next(leave);
    }
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    try {
      const data = await songsCollection.where("uid", "==", auth.currentUser.uid).get();

      data.forEach(this.addSong);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modifiedName = values.modifiedName;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },

    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };
      this.songs.push(song);
    },
    updatedUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  // Refs alows you to select components
  // They are scoped to the component they are in
  // beforeRouteLeave(to, from, next) {
  //   console.log(this.$refs.upload);
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
};
</script>
<style lang=""></style>
