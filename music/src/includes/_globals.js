import lodash from "lodash";

export default {
  install(app) {
    console.log("console.log(app);", app);
    // 1) Path for components relative to current file
    // 2) Lets webpack know to search through sub directories.
    // 3) Regex to find all vue files
    const baseComponents = require.context(
      "../components/base/",
      false,
      /[A-Za-z0-9-_,\s]+\.vue$/i
    );

    baseComponents.keys().forEach((fileName) => {
      const componentConfig = baseComponents(fileName);
      // 1) Search for ./ in srting. just gets the name
      // 2) remove .vue from the name
      const componentName = lodash.upperFirst(
        lodash.camelCase(fileName.replace(/^\.\//, "").replace(/\.\w+$/, ""))
      );

      app.component(`Base${componentName}`, componentConfig.default || componentConfig);
    });
  },
};
