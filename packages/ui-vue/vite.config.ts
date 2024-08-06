import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import dts from "vite-plugin-dts";
import { isVue2, isVue3 } from "vue-demi";
import * as compiler from "@vue/compiler-sfc";

console.log({ isVue2, isVue3 });

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  optimizeDeps: {
    exclude: ["csstype", "vue-demi"],
  },
  build: {
    target: "es2018",
    outDir: "lib",
    // outDir: isVue2 ? "lib/vue2" : "lib/vue3",
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
    lib: {
      formats: ["es", "cjs"],
      entry: path.resolve("src/index.ts"),
      name: "@tonconnect/ui-vue",
      fileName: (format) => {
        switch (format) {
          case "es":
            return "index.mjs";
          case "cjs":
            return "index.cjs";
          default:
            throw new Error("Unknown format");
        }
      },
    },
    rollupOptions: {
      external: ["vue", "vue-router", "@tonconnect/ui"],
      output: {
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          "@tonconnect/ui": "TON_CONNECT_UI",
        },
      },
    },
  },
});
