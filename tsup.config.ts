import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm"],
  outDir: "dist",
  dts: true, // generate .d.ts
  sourcemap: true,
  clean: true,
});
