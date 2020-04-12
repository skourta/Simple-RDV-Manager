import db from "../../plugins/ndeb";

export const state = () => ({
  rdvs: []
});

export const mutations = {
  set_rdvs(state, rdvs) {
    state.rdvs = rdvs;
  }
};
export const getters = {
  get_rdvs: state => {
    return state.rdvs;
  }
};
export const actions = {
  async fetchrdvs({ dispatch, commit, getters, rootGetters }, payload) {
    try {
      await db.rdvs.find({}).then(rdvs => {
        commit("set_rdvs", rdvs);
      });
    } catch (error) {
      console.log(error);
    }
  },
  async fetchrdvsDay({ dispatch, commit, getters, rootGetters }, payload) {
    try {
      await db.rdvs.find({ date: payload }).then(rdvs => {
        commit("set_rdvs", rdvs);
      });
    } catch (error) {
      console.log(error);
    }
  },
  async fetchrdvsPatient({ dispatch, commit, getters, rootGetters }, payload) {
    try {
      await db.rdvs.find({ patientID: payload }).then(rdvs => {
        commit("set_rdvs", rdvs);
      });
    } catch (error) {
      console.log(error);
    }
  },
  async checkDoubles({ dispatch, commit, getters, rootGetters }, payload) {
    try {
      const result = await db.rdvs.find({ full: payload });
      console.log(result);
      return result.length === 0;
    } catch (error) {
      console.log(error);
    }
  },
  async addRDV({ dispatch, commit, getters, rootGetters }, { rdv, patient }) {
    let patId = patient;
    if (typeof patient !== "string") {
      const newPatient = await dispatch("patients/addPatient", patient, {
        root: true
      });
      patId = newPatient._id;
      console.log(newPatient);
      console.log(patId);
      await db.rdvs.insert({
        ...rdv,
        patientID: patId,
        full: patId + rdv.date + rdv.time
      });
      return true;
    } else {
      const noDoubles = await dispatch(
        "checkDoubles",
        patId + rdv.date + rdv.time
      );
      if (noDoubles) {
        await db.rdvs.insert({
          ...rdv,
          patientID: patId,
          full: patId + rdv.date + rdv.time
        });
        return true;
      } else {
        throw "Ce RDV existe deja!!";
      }
    }
  },
  async updaterdv({ dispatch, commit, getters, rootGetters }, modif) {
    try {
      await db.rdvs.update({ _id: modif._id }, modif).then(rdvs => {});
    } catch (error) {
      console.log(error);
    }
  },
  async removerdv({ dispatch, commit, getters, rootGetters }, modif) {
    try {
      await db.rdvs.remove({ _id: modif._id }).then(rdvs => {});
    } catch (error) {
      console.log(error);
    }
  }
};
