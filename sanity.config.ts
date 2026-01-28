import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "hanato",
  title: "花人-Hanato-",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "2rsm38by",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
