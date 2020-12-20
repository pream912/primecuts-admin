<template>
    <div>
        <v-navigation-drawer color="#01203f" dark v-model="drawer" app clipped>
            <v-list dense nav>
                <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                :to="item.link">
                    <v-list-item-icon>
                        <v-icon> {{item.icon}} </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title> {{item.title}} </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar dark clipped-left app color="#01203f"> 
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Primecuts Admin</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <!-- <v-btn @click="logout" light color="#5cdb95">Logout</v-btn> -->
        </v-app-bar>
        <v-main>
            <v-alert style="z-index: 9999" :value="alert.alert" :type="alert.type">{{alert.message}}</v-alert>
            <router-view></router-view>
        </v-main>
    </div>
</template>

<script>
// import firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/database'
export default {
    name: 'App',
    data: () => ({
        drawer: false,
        items: [
            {title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/'},
            {title: 'Orders', icon: 'mdi-cart', link: '/orders'},
            {title: 'Circles', icon: 'mdi-map-marker-circle', link: '/circles'},
            {title: 'Products', icon: 'mdi-barcode-scan', link: '/products'},
            {title: 'Vendors', icon: 'mdi-account-switch', link: '/vendors'},
            {title: 'Price list', icon: 'mdi-clipboard-text', link: '/plist'},
        ]
    }),
    // methods: {
    //     logout () {
    //         var roll = this.$store.getters.loadedRoll
    //         firebase.auth().signOut()
    //         firebase.database().ref('users/'+roll).update({online: false, last_seen: firebase.database.ServerValue.TIMESTAMP})
    //     }
    // },
    computed: {
        alert () {
            return this.$store.getters.alert
        }
    }
}
</script>
