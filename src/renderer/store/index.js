export const state = () => ({
  error: { state: false, message: "" }
});
export const mutations = {
  set_error(state, error) {
    state.error = error;
  }
};
export const getters = {
  get_error: state => {
    return state.error;
  }
};
export const actions = {
  getErrorMessage({ dispatch, commit, getters, rootGetters }, error) {
    if (typeof error === "string") {
      return error;
    } else {
      if (error.response !== undefined) {
        if (error.response.data.message !== undefined) {
          return error.response.data.message.toString();
        } else if (error.message !== undefined) {
          return error.message;
        }
      } else {
        return error.message;
      }
    }
  },

  async exceptionHandler({ dispatch, commit }, error) {
    const errorMessage = await dispatch("getErrorMessage", error);
    commit("set_error", { state: true, message: errorMessage });
  }
};
