module.exports = {
  presets: [
    '@babel/preset-env', // Transpile modern JavaScript to older versions for compatibility
    '@babel/preset-react', // Support for JSX and React
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // Handle runtime helpers
  ],
};
