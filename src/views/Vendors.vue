<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn @click="newVendor" color="green">Add vendor</v-btn>
            </v-col>
            <v-col cols="12">
                <v-data-table
                :headers="headers"
                :items="vendors"
                class="elevation-1">
                    <!-- eslint-disable-next-line-->
                    <template v-slot:item.actions="{ item }">
                        <v-icon small color="orange" @click="editItem(item)">mdi-pencil</v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-dialog v-model="addDialog" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Vendor Details</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="vcode" label="Vendor code" readonly></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="vname" label="Vendor name" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="phone" label="Phone number" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="address" label="Address" required></v-textarea>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn v-if="!editing" @click="createVendor" :loading="creating" color="green">Create</v-btn>
                            <v-btn v-if="editing" @click="updateVendor" :loading="creating" color="green">Update</v-btn>
                            <v-btn color="red" @click="close">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>  
                </v-dialog>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
    data: () => ({
        headers: [
            {text: 'Vendor code', value: 'vcode'},
            {text: 'Vendor name', value: 'vname'},
            {text: 'Phone', value: 'phone'},
            {text: 'Actions', value: 'actions'}
        ],
        id: '',
        addDialog: false,
        vname: '',
        vcode: '',
        code: undefined,
        address: '',
        phone: '',
        creating: false,
        editing: false
    }),

    methods: {
        close () {
            this.vname = ''
            this.vcode = ''
            this.address = ''
            this.phone = ''
            this.code = undefined
            this.editing = false
            this.addDialog = false
        },

        newVendor () {
            this.addDialog = true
            this.getCode()
        },

        getCode () {
            firebase.database().ref('codes/vendors').once('value')
            .then(data => {
                var prefix = 'V'
                this.code = +data.val() + 1
                this.vcode = `${prefix}${this.code}`
            })
        },

        createVendor() {
            this.creating = true
            var vendor = {
                vcode: this.vcode,
                vname: this.vname,
                phone: this.phone,
                address: this.address
            }
            firebase.database().ref('vendors').push(vendor)
            .then(() => {
                firebase.database().ref('codes/vendors').set(this.code)
                this.creating = false
                this.$store.dispatch('getVendors')
                this.createAlert('success', 'New vendor successfully created!')
                this.close()
            })
            .catch(err => {
                this.createAlert('error', err.message)
                this.close()
            })
        },

        editItem(item) {
            this.editing = true
            this.id = item.id
            this.vcode = item.vcode
            this.vname = item.vname
            this.phone = item.phone
            this.address = item.address
            this.addDialog = true
        },

        updateVendor () {
            this.creating = true
            var vendor = {
                vcode: this.vcode,
                vname: this.vname,
                phone: this.phone,
                address: this.address
            }
            firebase.database().ref(`vendors/${this.id}`).set(vendor)
            .then(() => {
                this.creating = false
                this.$store.dispatch('getVendors')
                this.createAlert('info', 'New vendor successfully updated!')
                this.close()
            })
            .catch(err => {
                this.createAlert('error', err.message)
                this.close()
            })
        },

        createAlert(type, message) {
            this.$store.dispatch('createAlert', {type: type, message: message})
        }
    },

    computed: {
        vendors () {
            return this.$store.getters.loadedVendors
        }
    }
}
</script>