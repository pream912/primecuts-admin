<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn @click="new_circle_dialog = true">New circle</v-btn>
            </v-col>
            <v-col cols="12">
                <v-select :items="loadedCircles" label="Select circle"></v-select>
            </v-col>
        </v-row>
        <v-row>
            <v-dialog v-model="new_circle_dialog" persistent max-width="300px">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Circle name" v-model="new_circle_name"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn>Create</v-btn>
                        <v-btn @click="new_circle_dialog = false">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        new_circle_dialog: false,
        new_circle_name: ''
    }),

    computed: {
        loadedCircles () {
            return this.$store.getters.loadedCircles
        }
    }
}
</script>