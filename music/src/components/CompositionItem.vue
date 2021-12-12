<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-show="showForm">
      <div v-if="showAlert" :class="alertVariant" class="text-white text-center font-bold p-4 mb-4">
        {{ alertMessage }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updatedUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updatedUnsavedFlag(true)"
          />

          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="inSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="inSubmission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>
<script>
import { songsCollection, storage } from "@/includes/firebase";
export default {
  name: "AppCompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updatedUnsavedFlag: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: "required",
        genre: "alpha_spaces",
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Please wait updating song info",
    };
  },
  methods: {
    async edit(formData) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Please wait updating song info";

      try {
        await songsCollection.doc(this.song.docID).update(formData);
      } catch (error) {
        this.inSubmission = false;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Something went wrong try again later";
        return;
      }

      this.updateSong(this.index, formData);
      this.updatedUnsavedFlag(false);
      this.inSubmission = false;
      this.alertVariant = "bg-green-500";
      this.alertMessage = "Success!";
    },

    async deleteSong() {
      const storageReference = storage.ref();
      const songRef = storageReference.child(`songs/${this.song.originName}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docID).delete();
      this.removeSong(this.index);
    },
  },
};
</script>
