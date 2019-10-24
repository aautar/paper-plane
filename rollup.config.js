// rollup.config.js
export default [
  {
    input: 'src/PaperPlane.js',
    output: {
      format: 'esm',
      sourcemap: true,
      file: 'dist/paperplane.js'
    }
  }
];
