import SongItem from "@/components/SongItem.vue";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

// Passing data into component
describe("SongItem.vue", () => {
  test("render song.display_name", () => {
    const song = {
      displayName: "Rick Ashley",
    };
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      global: {
        components: {
          // TODO: this component breaks because we didnt have access to router link
          // We will use a stub (RouterLinkStub) as imported,  its called to mimic router link.
          // Stubbing creates fake components
          "router-link": RouterLinkStub,
        },
      },
    });

    const compositionAuthor = wrapper.find(".text-gray-500");
    expect(compositionAuthor.text()).toBe(song.displayName);
  });

  test("render song.docID in id attribute", () => {
    const song = {
      docID: "abc",
    };
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    // Tests for a dynamic attribute in this case an ID
    // It test the root element so the wrapper, is this was off it wouldnt work.
    // Or I supposed you could select the item and then see it it works
    // expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`);

    // To contain searches strings and arrays, the classes method will give back an array
    expect(wrapper.classes()).toContain(`song-id-${song.docID}`);
  });
});
