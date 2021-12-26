import About from "@/views/About.vue";
import { shallowMount } from "@vue/test-utils";

// Describe is used to group tests together.
// Shallow mount limits the children components in a component to one level.
// It islotes components and doesnt show children

describe("About.vue", () => {
  test("renders inner text", () => {
    const wrapper = shallowMount(About);
    expect(wrapper.text()).toContain("about");
  });
});
