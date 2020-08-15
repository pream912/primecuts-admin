const state = {
    alert: {}
}

const mutations = {
    SET_ALERT (state, payload) {
        state.alert = payload
    },
}

const actions = {
    createAlert ({commit}, payload) {
        const data = {
            alert: true,
            type: payload.type,
            message: payload.message
        }
        commit('SET_ALERT', data)
        setTimeout(() => {
          commit('SET_ALERT', {alert: false})
        }, 3000);
    },  
}

const getters = {
    alert (state) {
        return state.alert
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}