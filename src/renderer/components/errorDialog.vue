<template>
  <v-dialog style="z-index: 10000" v-model="errorDialog">
    <v-card>
      <v-alert dense outlined type="error" class="ma-0">{{this.get_error.message}}</v-alert>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ErrorDialog",
  computed: {
    ...mapGetters(["get_error"]),
    errorDialog: {
      get() {
        return this.get_error.state;
      },
      set(value) {
        if (!value) this.set_error({ state: false, message: "" });
      }
    }
  },
  methods: {
    ...mapMutations(["set_error"])
  }
};
</script>

<style scoped>
</style>
