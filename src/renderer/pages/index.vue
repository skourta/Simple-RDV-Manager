<template>
  <div>
    <v-card>
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold basil--text">Plateforme de prise de RDV médicaux</h1>
      </v-card-title>

      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(item,idx) in items" :key="idx" class="pa-5">
          <v-menu
            v-if="idx === 1"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                label="Date"
                prepend-icon="fas fa-calendar-alt"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="dateChosen()"></v-date-picker>
          </v-menu>
          <v-autocomplete
            v-if="idx === 2"
            :items="get_patients"
            :filter="customFilter"
            color="white"
            item-text="name"
            item-value="_id"
            label="Patient"
            outlined
            v-model="patient"
          ></v-autocomplete>
          <v-expansion-panels v-if="(get_rdvs.length > 0)">
            <v-expansion-panel v-for="rdv in get_rdvs" :key="rdv._id">
              <v-expansion-panel-header>{{rdv.time}}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <AfficherRDV :rdv="rdv" @modification="modifHandler()"></AfficherRDV>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div v-else class="text-center">
            <h2>Pas de RDV</h2>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import AfficherRDV from "../components/afficherRDV";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    AfficherRDV
  },
  data() {
    return {
      tab: null,
      items: ["RDV d'Aujoud'hui", "RDV d'un jour fix", "RDV d'un patient"],
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      menu: false,
      date: "",
      patient: null
    };
  },
  computed: {
    ...mapGetters("rdvs", ["get_rdvs"]),
    ...mapGetters("patients", ["get_patient", "get_patients"]),
    getDate() {
      return (
        new Date().getFullYear() +
        "-" +
        this.getCorrectFormat(true) +
        "-" +
        this.getCorrectFormat(false)
      );
    }
  },
  methods: {
    ...mapActions("rdvs", ["fetchrdvsDay", "fetchrdvsPatient"]),
    getCorrectFormat(isMonth) {
      let month = "";
      month = isMonth ? new Date().getMonth() : new Date().getDate();
      return month < 10 ? "0" + month : month.toString();
    },
    dateChosen() {
      this.menu = false;
      this.fetchrdvsDay(this.date);
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    modifHandler() {
      switch (this.tab) {
        case 0:
          // console.log(this.getDate);
          console.log(this.get_patient("0xbnbxgHKHtUfY9o"));
          this.fetchrdvsDay(this.getDate);
          console.log(this.get_rdvs);
          break;
        case 1:
          this.fetchrdvsDay(this.date);
          break;
        case 2:
          this.fetchrdvsPatient(this.patient);
        default:
          break;
      }
    }
  },
  watch: {
    tab(newValue, oldValue) {
      switch (newValue) {
        case 0:
          // console.log(this.getDate);
          console.log(this.get_patient("0xbnbxgHKHtUfY9o"));
          this.fetchrdvsDay(this.getDate);
          console.log(this.get_rdvs);
          break;
        case 1:
          this.fetchrdvsDay(this.date);
          break;
        case 2:
          this.fetchrdvsPatient(this.patient);
        default:
          break;
      }
    },
    patient(newValue, oldValue) {
      this.fetchrdvsPatient(newValue);
    }
  }
};
</script>

<style>
</style>
