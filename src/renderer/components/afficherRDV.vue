<template>
  <v-card>
    <v-card-title>RDV</v-card-title>
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
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  components: {},
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
    rdv: {
      date: "",
      time: "",
      objet: ""
    },
    menu: false,
    time: false
  }),
  methods: {}
};
</script>

<style>
</style>
