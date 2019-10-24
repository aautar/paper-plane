// rollup.config.js
import minify from 'rollup-plugin-babel-minify';

export default [
  {
    input: 'src/PaperPlane.window.js',
    output: {
      format: 'esm',
      sourcemap: true,
      file: 'dist/paperplane.min.js'
    },
	plugins: [
		minify({
            comments: false      
        })
	]
  }  
];
