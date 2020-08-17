<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn @click="addDialog = true" color="green">Create pricelist</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-dialog v-model="addDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar>
                        <v-btn icon color="red" @click="close">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>New Pricelist</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn @click="createPlist" :loading="creating" color="green" text>Save</v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-container>
                        <v-row>
                            <v-col xl="2" sm="4" cols="12">
                                <v-menu
                                    v-model="dmenu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="date"
                                        label="Select date"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" @input="dmenu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12">
                                <v-data-table
                                :headers="headers"
                                :items="items"
                                class="elevation-1">
                                    <!-- eslint-disable-next-line-->
                                    <template v-slot:item.actions="{ item }">
                                        <v-icon small color="orange" @click="editItem(item)">mdi-pencil</v-icon>
                                    </template>
                                </v-data-table>
                            </v-col>
                            <v-col cols="12">
                                <v-btn @click="addItemDialog = true" color="green" rounded>Add product</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-row>
        <v-row>
            <v-dialog v-model="addItemDialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">List Item</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col sm="4" cols="12">
                                <v-autocomplete
                                label="Product"
                                @change="fillProduct"
                                :items="products"
                                item-text="pname"
                                item-value="id"
                                v-model="item.pid"
                                ></v-autocomplete>
                            </v-col>
                            <v-col sm="4" cols="12">
                                <v-text-field v-model="item.cat" label="Category" readonly></v-text-field>
                            </v-col>
                            <v-col sm="4" cols="12">
                                <v-text-field v-model="item.uom" label="UOM" readonly></v-text-field>
                            </v-col>
                            <v-col sm="4" cols="12">
                                <v-text-field v-model="item.pp" label="Purchase price"></v-text-field>
                            </v-col>
                            <v-col sm="4" cols="12">
                                <v-text-field v-model="item.sp" label="Selling price"></v-text-field>
                            </v-col>
                            <v-col sm="4" cols="12">
                                <v-text-field v-model="calMargin" label="Selling price" readonly></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-autocomplete
                                label="Vendor"
                                :items="vendors"
                                item-text="vname"
                                item-value="id"
                                v-model="item.vid"
                                ></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="!itemEditing" color="green" @click="addItem">Add</v-btn>
                        <v-btn v-if="itemEditing" color="green" @click="updateItem">Update</v-btn>
                        <v-btn color="red" @click="closeItem">Cancel</v-btn>
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
            {text: 'Product Name', value: 'pname'},
            {text: 'Product category', value: 'cat'},
            {text: 'Vendor', value: 'vname'},
            {text: 'Purchase price', value: 'pp'},
            {text: 'Selling price', value: 'sp'},
            {text: 'Margin', value: 'margin'},
            {text: 'Actions', value: 'actions'},
        ],
        addDialog: false,
        creating: false,
        itemEditing: false,
        itemIndex: undefined,
        addItemDialog: false,
        date: new Date().toISOString().substr(0, 10),
        dmenu: false,
        item: {
            pid: '',
            vid: '',
            pp: undefined,
            sp: undefined,
            uom: '',
            cat: ''
        },
        items: [],
    }),

    methods: {
        close () {
            this.addDialog = false
        },

        closeItem () {
            this.item = {
                pid: '',
                vid: '',
                pp: undefined,
                sp: undefined,
                uom: '',
                cat: ''
            }
            this.itemIndex = undefined
            this.itemEditing = false
            this.addItemDialog = false
        },

        fillProduct () {
            var product = this.$store.getters.findProduct(this.item.pid)
            this.item.uom = product.uom
            this.item.cat = product.cat
        },

        addItem () {
            var product = this.$store.getters.findProduct(this.item.pid)
            var vendor = this.$store.getters.findVendor(this.item.vid)
            var item = {
                pcode: product.pcode,
                pname: product.pname,
                uom: product.uom,
                cat: product.cat,
                vname: vendor.vname,
                pid: this.item.pid,
                vid: this.item.vid,
                pp: this.item.pp,
                sp: this.item.sp,
                margin: this.calMargin
            }
            this.items.push(item)
            this.closeItem()
        },

        editItem (item) {
            this.itemIndex = this.items.indexOf(item)
            this.itemEditing = true
            this.item.pid = item.pid
            this.item.vid = item.vid
            this.item.pp = item.pp
            this.item.sp = item.sp
            this.item.uom = item.uom
            this.item.cat = item.cat
            this.addItemDialog = true
        },

        updateItem () {
            var product = this.$store.getters.findProduct(this.item.pid)
            var vendor = this.$store.getters.findVendor(this.item.vid)
            var item = {
                pcode: product.pcode,
                pname: product.pname,
                uom: product.uom,
                cat: product.cat,
                vname: vendor.vname,
                pid: this.item.pid,
                vid: this.item.vid,
                pp: this.item.pp,
                sp: this.item.sp,
                margin: this.calMargin
            }
            this.items.splice(this.itemIndex, 1)
            this.items.push(item)
            this.closeItem()
        },

        createPlist () {
            this.creating = true
            var plist = []
            var items = this.items
            for (let i in items) {
                plist.push({
                    pid: items[i].pid,
                    vid: items[i].vid,
                    pp: items[i].pp,
                    sp: items[i].sp,
                })
            }
            firebase.database().ref(`plists/${this.date}`).once('value')
            .then(data => {
                if(data.val()) {
                    this.createAlert('error', 'Pricelist already available for the selected date!')
                    this.creating = false
                }
                else {
                    firebase.database().ref(`plists/${this.date}`).set({plist: plist})
                    .then(() => {
                        this.createAlert('success', 'Pricelist successfully created!')
                        this.creating = false
                        this.close()
                    })
                    .catch(err => {
                        this.createAlert('error', err.message)
                        this.creating = false
                    })
                }
            })
        },

        createAlert(type, message) {
            this.$store.dispatch('createAlert', {type: type, message: message})
        }
    },

    computed: {
        products () {
            return this.$store.getters.loadedProducts
        },
        
        vendors () {
            return this.$store.getters.loadedVendors
        },

        calMargin () {
            if (this.item.sp && this.item.pp) {
                var margin = +this.item.sp - +this.item.pp
                return margin
            }
            else {
                return ''
            }
        }
    }
}
</script>