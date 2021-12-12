<template lang="">
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        @click.prevent="newSong(song)"
      >
        <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section id="comments" class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.commentCount }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          v-if="commentShowAlert"
          class="text-white text-center font-bold p-4 mb-4"
          :class="commentAlertVariant"
        >
          {{ commentAlertMessage }}
        </div>
        <vee-form v-if="userLoggedIn" :validation-schema="schema" @submit="postComment">
          <vee-field
            as="textarea"
            name="comment"
            type="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></vee-field>
          <ErrorMessage class="text-red-600" name="comment" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="commentInSubmission"
          >
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      v-for="comment in sortedComments"
      :key="comment.docID"
      class="p-6 bg-gray-50 border border-gray-200"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
        <p>
          {{ comment.content }}
        </p>
      </div>
    </li>
  </ul>
</template>
<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "AppSong",
  data: function () {
    return {
      song: {},
      schema: {
        comment: "required|min:3",
      },
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: "bg-blue-500",
      commentAlertMessage: "Please wait your comment is being submitted",
      comments: [],
      sort: "1",
    };
  },
  computed: {
    ...mapGetters(["playing"]),
    ...mapState(["userLoggedIn"]),
    sortedComments() {
      // the slice will return a new array man shit
      return this.comments.slice().sort((a, b) => {
        return this.sort === "1"
          ? new Date(b.datePosted) - new Date(a.datePosted)
          : new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
  async created() {
    const docSnapShot = await songsCollection.doc(this.$route.params.id).get();

    if (!docSnapShot.exists) {
      this.$router.push({ name: "home" });
      return;
    }

    const { sort } = this.$route.query;

    this.sort = sort === "1" || sort === "2" ? sort : "1";

    this.song = docSnapShot.data();
    this.getComments();
  },
  methods: {
    ...mapActions(["newSong"]),
    async postComment(values, { resetForm }) {
      this.commentInSubmission = true;
      this.commentShowAlert = true;
      this.commentAlertVariant = "bg-blue-500";
      this.commentAlertMessage = "Please wait your comment is being saved";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: "Cameron",
        uid: auth.currentUser.uid,
      };

      await commentsCollection.add(comment);

      this.song.commentCount += 1;
      await songsCollection.doc(this.$route.params.id).update({
        commentCount: this.song.commentCount,
      });

      this.getComments();

      this.commentInSubmission = false;
      this.commentAlertVariant = "bg-green-500";
      this.commentAlertMessage = "Comment has been saved";

      resetForm();
    },
    async getComments() {
      let snapShots = await commentsCollection.where("sid", "==", this.$route.params.id).get();
      this.comments = [];

      snapShots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    },
  },
};
</script>
<style lang=""></style>
