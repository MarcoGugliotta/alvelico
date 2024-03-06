module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  plugins.push('expo-router/babel');

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
