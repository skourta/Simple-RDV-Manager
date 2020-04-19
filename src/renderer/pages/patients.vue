<template>
  <div>
    <v-card>
      <v-card-title>Gestion des patients</v-card-title>
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
          ></v-autocomplete>
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

          <v-card-actions>
            <v-btn
              :disabled="!valid || patient === ''"
              color="blue"
              class="mr-4"
              @click="modify"
            >Modifier</v-btn>
            <v-btn color="red" class="mr-4" @click="reset">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >Ajouter un Patient</v-btn>
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

    patient: "",

    rdv: {
      date: "",
      time: "",
      objet: ""
    },
    menu: false,
    time: false,
    snackbar: false,
    notifMessage: ""
  }),

  methods: {
    ...mapActions(["exceptionHandler"]),
    ...mapActions("patients", ["addPatient", "removePatient", "updatePatient"]),
    validate() {
      this.addPatient(this.newPatientData)
        .then(val => {
          if (val) {
            this.notifMessage = "Patient ajoute!";
            this.snackbar = true;
          }
        })
        .catch(this.exceptionHandler);
    },
    modify() {
      console.log("test");
      this.updatePatient(this.newPatientData)
        .then(val => {
          this.notifMessage = "Patient modifie!";
          this.snackbar = true;
        })
        .catch(this.exceptionHandler);
    },
    // delet() {
    //   this.removePatient(this.newPatientData)
    //     .then(val => {
    //       if (val) {
    //         this.notifMessage = "Patient Supprime!";
    //         this.snackbar = true;
    //       }
    //     })
    //     .catch(this.exceptionHandler);
    // },
    async reset() {
      this.$refs.form.reset();
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    }
  },
  computed: {
    ...mapGetters("patients", ["get_patients", "get_patient"])
  },
  mounted() {
    this.rdv.date = this.getDate;
  },
  watch: {
    async patient(newValue, oldValue) {
      const pat = await this.get_patient(newValue);
      this.newPatientData = { ...pat };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>