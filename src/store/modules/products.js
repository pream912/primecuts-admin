import firebase from 'firebase/app'
import 'firebase/database'

const state = {
    products: [],
}

const mutations = {
    SET_PRODUCTS (state, payload) {
        state.products = payload
    }
}

const actions = {
    getProducts ({commit}) {
        firebase.database().ref('products').once('value')
        .then(data => {
            const products = []
            var obj = data.val()
            for (let key in obj) {
                    products.push({
                    id: key,
                    pcode: obj[key].pcode,
                    cat: obj[key].cat,
                    pname: obj[key].pname,
                    description: obj[key].description,
                    uom: obj[key].uom
                })
            }
            commit('SET_PRODUCTS', products)
        })
    }
}

const getters = {
    loadedProducts(state) {
        return state.products
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}