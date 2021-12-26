import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import SongItem from "@/components/SongItem.vue";

describe("Snapshot SongItem.vue", () => {
  test("renders correctly", () => {
    const song = {
      docID: "abc",
      modifiedName: "test",
      displayName: "test",
      commentCount: 3,
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    // main element of an item in component
    expect(wrapper.element).toMatchSnapshot();
  });
});
