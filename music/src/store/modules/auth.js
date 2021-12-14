import { auth, userCollection } from "@/includes/firebase";

export default {
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  getters: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  mutations: {},
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
  },
};

// Mutations are like reducers, they update state
