import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import SongItem from "@/components/SongItem.vue";

// Testing multiple components in a single view
// Always use mock data

// If I implemented the persistant storage it would break
// This is a way to mock some data.
// The first parameter is the path to the function
// Jest will prevent the file in the path from being imported
// it will tell jest to insert an empty object

jest.mock("@/includes/firebase", () => {});

describe("Home.vue", () => {
  test("renders list of songs", () => {
    const songs = [{}, {}, {}];

    // This is how you prevent an API call and use mock data instead
    Home.methods.getSongs = () => false;

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
    });

    // Returns an array of all components
    // or if you pass it a parameter(Which is a component) it will select that component.
    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, i) => {
      // Data comes in through a prop
      // therefor we access the wrapper prop
      // This tests to see if exactly what is sent in is gotten out.
      expect(wrapper.props().song).toStrictEqual(songs[i]);
    });
  });
});
