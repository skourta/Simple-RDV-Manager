<template>
  <div>
    <v-card>
      <v-card-title>Ajouter un RDV</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-autocomplete
            :disabled="newPatient"
            :items="get_patients"
            :filter="customFilter"
            color="white"
            item-text="name"
            item-value="_id"
            label="Patient"
            outlined
            v-model="patient"
            :rules="(!newPatient) ? nameRules : []"
          ></v-autocomplete>
          <v-switch v-model="newPatient" label="Nouveau Patient?"></v-switch>
          <v-expand-transition v-if="newPatient">
            <div>
              <v-text-field
                v-model="newPatientData.name"
                :rules="nameRules"
                label="Nom"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="newPatientData.prenom"
                :rules="nameRules"
                label="Prenom"
                required
                outlined
              ></v-text-field>
              <v-text-field
                ref="address"
                v-model="newPatientData.address"
                :rules="[
              () => !!newPatientData.address || 'Obligatoire',
            ]"
                label="Adresse"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="newPatientData.email"
                :rules="emailRules"
                label="E-mail"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="newPatientData.phone"
                :counter="10"
                :rules="phoneRules"
                label="Telephone"
                required
                outlined
              ></v-text-field>
              <v-textarea v-model="newPatientData.infoMed" label="Informations Medicales" outlined></v-textarea>
            </div>
          </v-expand-transition>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="rdv.date"
                label="Date"
                prepend-icon="fas fa-calendar-alt"
                readonly
                v-on="on"
                :rules="nameRules"
              ></v-text-field>
            </template>
            <v-date-picker v-model="rdv.date" @input="menu = false"></v-date-picker>
          </v-menu>
          <v-menu
            ref="timeMenu"
            v-model="time"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="rdv.time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="rdv.time"
                label="Heure"
                prepend-icon="fas fa-clock"
                v-on="on"
                :rules="nameRules"
                required
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="time"
              v-model="rdv.time"
              format="24hr"
              full-width
              @click:minute="$refs.timeMenu.save(rdv.time)"
              required
            ></v-time-picker>
          </v-menu>
          <v-textarea v-model="rdv.objet" label="Objet" outlined></v-textarea>
          <v-card-actions>
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Ajouter</v-btn>
            <v-btn color="success" class="mr-4" @click="createPatient">notif</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" color="success" :timeout="3000">
      <div class="d-flex" style="width:100%">
        <v-icon>fas fa-check</v-icon>
        <span style="paddingLeft: 1rem">{{notifMessage}}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import db from "../plugins/ndeb";
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    newPatient: false,
    valid: false,
    newPatientData: {
      name: "",
      email: "",
      address: "",
      prenom: "",
      phone: "",
      infoMed: ""
    },

    nameRules: [v => !!v || "Obligatoire."],

    emailRules: [
      v => !!v || "E-mail obligatoire",
      v => /.+@.+\..+/.test(v) || "E-mail Invalide."
    ],
    phoneRules: [
      v => !!v || "Telephone obligatoire",
      value => {
        const pattern = /^\d{4}\s*\d{2}\s*\d{2}\s*\d{2}$/;
        return pattern.test(value) || "Telephone Invalide.";
      }
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
    patient: "",

    rdv: {
      date: "2020-04-02",
      time: "10:05",
      objet: ""
    },
    menu: false,
    time: false,
    snackbar: false,
    notifMessage: ""
  }),

  methods: {
    ...mapActions("rdvs", ["addRDV"]),
    ...mapActions(["exceptionHandler"]),
    validate() {
      this.addRDV({
        rdv: this.rdv,
        patient: this.newPatient ? this.newPatientData : this.patient
      })
        .then(val => {
          if (val) {
            this.notifMessage = "RDV ajoute!";
            this.snackbar = true;
          }
        })
        .catch(this.exceptionHandler);
      // if (

      // ) {
      //   this.notifMessage = "RDV ajoute!";
      //   this.snackbar = true;
      // } else {
      //   console.log("RDV already exists");
      // }
    },
    async reset() {
      const proxies = await db.patients.find({});
      console.log(proxies);
      this.$refs.form.reset();
    },
    async createPatient() {
      this.snackbar = true;
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    }
  },
  computed: {
    ...mapGetters("patients", ["get_patients"])
  }
};
</script>

<style lang="scss" scoped>
</style>