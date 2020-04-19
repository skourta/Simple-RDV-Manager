<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant="miniVariant" color="grey darken-4" app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- <v-app-bar fixed app>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>-->
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <ErrorDialog></ErrorDialog>
    <v-footer fixed app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ErrorDialog from "../components/errorDialog";
export default {
  components: {
    ErrorDialog
  },
  data() {
    return {
      items: [
        {
          icon: "fas fa-calendar-alt",
          title: "Lister les RDVs",
          to: "/"
        },
        {
          icon: "fas fa-plus-circle",
          title: "Creer un RDV",
          to: "/newRDV"
        },
        {
          icon: "fas fa-plus-circle",
          title: "Gestion des Patients",
          to: "/patients"
        }
      ],
      miniVariant: false,
      title: "Plateforme de prise de RDV médicaux"
    };
  },
  mounted() {
    this.fetchPatients();
  },
  methods: {
    ...mapActions("patients", ["fetchPatients"])
  },
  computed: {
    ...mapGetters("patients", ["get_patients"])
  }
};
</script>