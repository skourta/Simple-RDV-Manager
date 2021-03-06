import db from "../../plugins/ndeb";
export const state = () => ({
  patients: []
});

export const mutations = {
  set_patients(state, patients) {
    state.patients = patients;
  }
};
export const getters = {
  get_patients: state => {
    return state.patients;
  },
  get_patient: state => id => {
    for (let idx = 0; idx < state.patients.length; idx++) {
      const element = state.patients[idx];
      console.log(id);
      if (element._id === id) return element;
    }
  }
};
export const actions = {
  async fetchPatients({ dispatch, commit, getters, rootGetters }, payload) {
    try {
      await db.patients.find({}).then(patients => {
        commit("set_patients", patients);
      });
    } catch (error) {
      console.log(error);
    }
  },
  async checkDoubles({ dispatch, commit, getters, rootGetters }, payload) {
    try {
      const result = await db.patients.find({ full: payload });
      console.log(result);
      return result.length === 0;
    } catch (error) {
      console.log(error);
    }
  },
  async addPatient({ dispatch, commit, getters, rootGetters }, payload) {
    const noDoubles = await dispatch(
      "checkDoubles",
      payload.name + payload.prenom
    );
    if (noDoubles) {
      const patient = await db.patients.insert({
        ...payload,
        full: payload.name + payload.prenom
      });
      dispatch("fetchPatients");
      return patient;
    } else {
      throw "This patient already exists";
    }
  },
  async updatePatient({ dispatch, commit, getters, rootGetters }, modif) {
    try {
      console.log(modif);
      await db.patients.update({ _id: modif._id }, modif).then(rdvs => {
        dispatch("fetchPatients");
        return 1;
      });
    } catch (error) {
      console.log(error);
    }
  }
  // async removePatient({ dispatch, commit, getters, rootGetters }, modif) {
  //   try {
  //     await db.patients.remove({ _id: modif._id }).then(rdvs => {});
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
};
