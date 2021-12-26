import { createStore } from "vuex";
import auth from "@/store/modules/auth";

// creates copy of object and is not referenced by original object
// We use this because we dont want the same version of state in each test
// The two tests are isolated from one another
import { cloneDeep } from "lodash";

import player from "@/store/modules/player";

// This is how you mock data from a get request
jest.mock("@/includes/firebase", () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve(),
  },
}));

describe("Vuex Store", () => {
  test("toggleAuth mutation sets userLoggedIn to true", () => {
    const clonedAuth = cloneDeep(auth);
    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.auth.userLoggedIn).toBe(false);
    store.commit("toggleAuth");
    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  // Testing actions
  test("login action sets userLoggedIn to true", async () => {
    // two assertions must be made or test will fail
    expect.assertions(2);

    const clonedAuth = cloneDeep(auth);
    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.auth.userLoggedIn).toBe(false);
    await store.dispatch("login", { email: "", password: "" });
    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  //  testing getters
  test("playing returns true if audio is playing", () => {
    const state = {
      sound: {
        playing: () => true,
      },
    };

    const result = player.getters.playing(state);

    expect(result).toEqual(true);
  });
});
