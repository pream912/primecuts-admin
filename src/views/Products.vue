<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn @click="addDialog = true" color="green">Add product</v-btn>
            </v-col>
            <v-col cols="12">
                <v-data-table
                :headers="headers"
                :items="products"
                class="elevation-1">
                    <!-- eslint-disable-next-line-->
                    <template v-slot:item.actions="{ item }">
                        <v-icon small color="orange" @click="editItem(item)">mdi-pencil</v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row>
            <v-dialog v-model="addDialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Product Details</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-select v-if="!editing" @input="getCode" label="Category" :items="cats" v-model="cat"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="pcode" label="Product code" readonly></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="pname" label="Product name" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select label="UOM" :items="uoms" v-model="uom"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="description" label="Product description" required></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="!editing" @click="createProduct" :loading="creating" color="green">Create</v-btn>
                        <v-btn v-if="editing" @click="updateProduct" :loading="creating" color="green">Update</v-btn>
                        <v-btn color="red" @click="close">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
    data: () => ({
        headers: [
            {text: 'Product code', value: 'pcode'},
            {text: 'Product name', value: 'pname'},
            {text: 'Category', value: 'cat'},
            {text: 'Actions', value: 'actions'}
        ],
        id: '',
        addDialog: false,
        pname: '',
        pcode: '',
        code: undefined,
        description: '',
        uom: '',
        cat: '',
        cats: ['Chicken', 'Mutton', 'Sea-food', 'Egg', 'Frozen', 'Other'],
        uoms: ['Kg', 'Pack', 'Piece'],
        creating: false,
        editing: false
    }),

    methods: {
        close () {
            this.pname = ''
            this.pcode = ''
            this.description = ''
            this.uom = ''
            this.cat = ''
            this.code = undefined
            this.editing = false
            this.addDialog = false
        },

        getCode () {
            firebase.database().ref(`codes/${this.cat}`).once('value')
            .then(data => {
                var prefix = this.cat.charAt(0)
                this.code = +data.val() + 1
                this.pcode = `${prefix}${this.code}`
            })
        },

        createProduct () {
            this.creating = true
            var product = {
                cat: this.cat,
                pcode: this.pcode,
                pname: this.pname,
                uom: this.uom,
                description: this.description
            }
            firebase.database().ref('products').push(product)
            .then(() => {
                firebase.database().ref(`codes/${this.cat}`).set(this.code)
                this.creating = false
                this.$store.dispatch('getProducts')
                this.createAlert('success', 'New product successfully created!')
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
            this.pcode = item.pcode
            this.pname = item.pname
            this.cat = item.cat
            this.uom = item.uom
            this.description = item.description
            this.addDialog = true
        },

        updateProduct () {
            this.creating = true
            var product = {
                cat: this.cat,
                pcode: this.pcode,
                pname: this.pname,
                uom: this.uom,
                description: this.description
            }
            firebase.database().ref(`products/${this.id}`).set(product)
            .then(() => {
                this.creating = false
                this.$store.dispatch('getProducts')
                this.createAlert('info', 'Product successfully updated!')
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
        products () {
            return this.$store.getters.loadedProducts
        }
    }
}
</script>