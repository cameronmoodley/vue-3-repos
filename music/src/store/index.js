import { createStore } from "vuex";
import { auth, userCollection } from "@/includes/firebase";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  },
  getters: {
    // Not being called but used to do a calculation like computed method.
    // getAuthModalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong: (state, payload) => {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());

      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  actions: {
    async register({ commit }, { email, password, name, age, country, userType }) {
      const userCred = await auth.createUserWithEmailAndPassword(email, password);

      await userCollection.doc(userCred.user.uid).set({
        name,
        email,
        age,
        country,
        userType,
      });

      await userCred.user.updateProfile({
        displayName: name,
      });

      commit("toggleAuth");
    },

    initLogin({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit("toggleAuth");
      }
    },
    async login({ commit }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);
      commit("toggleAuth");
    },
    async signout({ commit }, { router, route }) {
      console.log("It works");
      await auth.signOut();
      commit("toggleAuth");

      if (route.meta.requiresAuth) {
        router.push({ name: "home" });
      }
    },

    async newSong({ commit, state, dispatch }, payload) {
      commit("newSong", payload);
      state.sound.play();

      state.sound.on("play", () => {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      });
    },

    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        console.log("returned");
        return;
      }

      if (state.sound.playing()) {
        console.log("paused");
        state.sound.pause();
      } else {
        console.log("playing");
        state.sound.play();
      }
    },

    progress({ commit, state, dispatch }) {
      commit("updatePosition");

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      }
    },

    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once("seek", () => {
        dispatch("progress");
      });
    },
  },
});

// Mutations are like reducers, they update state
