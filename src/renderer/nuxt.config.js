/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  mode: "spa", // or 'universal'
  head: {
    title: "alogtp_rdv_med"
  },
  loading: false,
  plugins: [{ ssr: true, src: "@/plugins/icons.js" }],
  buildModules: [],
  modules: ["@nuxtjs/vuetify"],
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#27ae60",
          secondary: "#e74c3c",
          accent: "#e67e22",
          error: "#c0392b"
        }
      }
    },
    defaultAssets: {
      icon: "fa"
    }
  }
};
