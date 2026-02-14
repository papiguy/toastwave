import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.jsx",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions: [".js", ".jsx"] }),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
      extensions: [".js", ".jsx"],
      exclude: "node_modules/**",
    }),
    terser(),
  ],
};
