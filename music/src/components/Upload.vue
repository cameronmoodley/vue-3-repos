<template lang="">
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div
        v-for="singleUpload in uploads"
        :key="singleUpload.name"
        class="mb-4"
      >
        <!-- File Name -->
        <div class="font-bold text-sm" :class="singleUpload.textClass">
          <i :class="singleUpload.icon"></i> {{ singleUpload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="singleUpload.variant"
            :style="{ width: singleUpload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storage, auth, songsCollection } from "@/includes/firebase";

export default {
  name: "AppUpload",
  props: {
    addSong: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isDragover: false,
      uploads: []
    };
  },
  beforeUnmount() {
    // kills the upload when you move away from page
    // task was added to the object
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
  methods: {
    upload(evt) {
      this.isDragover = false;

      // chrome will not show the file if you log the event out.
      // You need to access the property.
      const files = evt.dataTransfer
        ? [...evt.dataTransfer.files]
        : [...evt.target.files];
      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }

        // this line of code will create folders on the server
        // when you browse at a url storageRef will lead to the root of this site: music-2215b.appspot.com
        // This URL is set in the config file
        const storageRef = storage.ref();
        // This line of code will create a sub directory in the url provided above.
        // It will take a parameter of the directory name (songs) music-2215b.appspot.com/songs
        // Good Practice to do it this way get the main root and then add more on to it
        const songsRef = storageRef.child(`songs/${file.name}`);
        // This is how you upload files to firebase
        const task = songsRef.put(file);
        const uploadIndex =
          this.uploads.push({
            task,
            currentProgress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            textClass: ""
          }) - 1;

        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].currentProgress = progress;
          },
          () => {
            this.uploads[uploadIndex].variant = "bg-red-500";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].textClass = "text-red-400";
          },
          async () => {
            // this is the success function
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              originName: task.snapshot.ref.name,
              modifiedName: task.snapshot.ref.name,
              genre: "",
              commentCount: 0
            };

            song.url = await task.snapshot.ref.getDownloadURL();

            const songRef = await songsCollection.add(song);
            const songSnapsot = await songRef.get();

            this.addSong(songSnapsot);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].textClass = "text-green-400";
          }
        );
      });
    }
  }
};
</script>
<style lang=""></style>
