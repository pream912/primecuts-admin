import firebase from 'firebase/app'
import 'firebase/database'

const state = {
    vendors: [],
}

const mutations = {
    SET_VENDORS (state, payload) {
        state.vendors = payload
    }
}

const actions = {
    getVendors ({commit}) {
        firebase.database().ref('vendors').once('value')
        .then(data => {
            const vendors = []
            var obj = data.val()
            for (let key in obj) {
                    vendors.push({
                    id: key,
                    vcode: obj[key].vcode,
                    phone: obj[key].phone,
                    vname: obj[key].vname,
                    address: obj[key].address,
                })
            }
            commit('SET_VENDORS', vendors)
        })
    }
}

const getters = {
    loadedVendors(state) {
        return state.vendors
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}