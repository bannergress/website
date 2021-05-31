const CracoAntDesignPlugin = require("craco-antd");

const CracoEslintWebpackPlugin = require('craco-eslint-webpack-plugin');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "@primary-color": "#1DA57A",
          "@link-color": "#1DA57A",
          "@body-background": "#0b0c0d",
          '@card-head-padding': "0.6rem",
          '@card-padding-base': "0.6rem",
          '@border-color-base': "#004f4a"
        },
      },
    },
    {
      plugin: CracoEslintWebpackPlugin,
      options: {
        // See the options description below
        skipPreflightCheck: true,
        eslintOptions: {
          files: 'src/**/*.{js,jsx,ts,tsx}',
          lintDirtyModulesOnly: true,
        },
      },
    },
  ],
};
