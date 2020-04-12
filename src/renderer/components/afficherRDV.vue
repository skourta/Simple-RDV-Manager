<template>
  <v-card flat>
    <v-card-text>
      <v-container ref="form">
        <h1 class="diplay-3 white--text mb-5"></h1>
        <v-row>
          <v-text-field class="mx-3" v-model="newPatientData.name" label="Nom" outlined readonly></v-text-field>
          <v-text-field
            class="mx-3"
            v-model="newPatientData.prenom"
            label="Prenom"
            outlined
            readonly
          ></v-text-field>
        </v-row>
        <v-switch v-model="newPatient" label="Afficher toutes les informations du patient?"></v-switch>
        <v-expand-transition v-if="newPatient">
          <div>
            <v-text-field
              ref="address"
              v-model="newPatientData.address"
              label="Adresse"
              outlined
              readonly
            ></v-text-field>
            <v-row>
              <v-text-field
                class="mx-3"
                v-model="newPatientData.email"
                label="E-mail"
                readonly
                outlined
              ></v-text-field>
              <v-text-field
                class="mx-3"
                v-model="newPatientData.phone"
                :counter="10"
                label="Telephone"
                outlined
                readonly
              ></v-text-field>
            </v-row>
            <v-textarea
              v-model="newPatientData.infoMed"
              label="Informations Medicales"
              outlined
              readonly
            ></v-textarea>
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
            ></v-text-field>
          </template>
          <v-date-picker v-model="rdv.date" @input="menu = false" readonly></v-date-picker>
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
            <v-text-field v-model="rdv.time" label="Heure" prepend-icon="fas fa-clock" v-on="on"></v-text-field>
          </template>
          <v-time-picker
            v-if="time"
            v-model="rdv.time"
            format="24hr"
            full-width
            @click:minute="$refs.timeMenu.save(rdv.time)"
            readonly
          ></v-time-picker>
        </v-menu>
        <v-textarea v-model="rdv.objet" label="Objet" outlined></v-textarea>
      </v-container>
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Modifier ce RDV</v-card-title>

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
                v-model="modifpatient"
                :rules="(!newPatient) ? nameRules : []"
              ></v-autocomplete>
              <v-menu
                v-model="menu7"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="modif.date"
                    label="Date"
                    prepend-icon="fas fa-calendar-alt"
                    readonly
                    v-on="on"
                    :rules="nameRules"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="modif.date" @input="menu7 = false"></v-date-picker>
              </v-menu>
              <v-menu
                ref="timeMenu7"
                v-model="time7"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="modif.time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="modif.time"
                    label="Heure"
                    prepend-icon="fas fa-clock"
                    v-on="on"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="time7"
                  v-model="modif.time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.timeMenu7.save(modif.time)"
                  required
                ></v-time-picker>
              </v-menu>
              <v-textarea v-model="modif.objet" label="Objet" outlined></v-textarea>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="dialog = false">Annuler</v-btn>

            <v-btn color="green darken-1" text @click="modifierRDV()">Modifier</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="imprimer()">imprimer ce RDV</v-btn>
      <v-btn color="blue" @click="dialog = true">modifier ce RDV</v-btn>
      <v-btn color="red" @click="supprimer()">Supprimer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { saveAs } from "file-saver";

import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    rdv: {
      type: Object,
      required: true
    }
  },
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
    menu: false,
    time: false,
    fetchedPatient: false,
    dialog: false,
    modif: {},
    menu7: false,
    time7: false,
    modifpatient: "",
    nameRules: [v => !!v || "Obligatoire."]
  }),
  computed: {
    ...mapGetters("patients", ["get_patient", "get_patients"])
  },
  async mounted() {
    this.newPatientData = await this.get_patient(this.rdv.patientID);
    this.modif = { ...this.rdv };
    this.modifpatient = this.rdv.patientID;
  },
  methods: {
    ...mapActions("rdvs", ["updaterdv", "removerdv"]),
    imprimer() {
      var blob = new Blob(
        [JSON.stringify({ rdv: this.rdv, Patient: this.newPatientData })],
        {
          type: "application/json"
        }
      );
      saveAs(
        blob,
        this.newPatientData.name.toUpperCase() +
          "_" +
          this.newPatientData.prenom.toUpperCase() +
          "_" +
          this.rdv.date +
          "_" +
          this.rdv.time +
          ".json"
      );
    },

    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    async modifierRDV() {
      await this.updaterdv({
        ...this.modif,
        patientID: this.modifpatient,
        full: this.modifpatient + this.modif.date + this.modif.time
      });

      this.dialog = false;
      this.$emit("modification");
    },
    async supprimer() {
      await this.removerdv(this.rdv);
      this.$emit("modification");
    }
  }
};
</script>

<style>
</style>
