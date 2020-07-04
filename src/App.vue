<template>
  <v-app>
    <app-layout></app-layout>
    <!-- <auth-form v-if="!authState"></auth-form> -->
  </v-app>
</template>

<script>
import AppLayout from './views/AppLayout'
// import AuthForm from './views/Auth'

export default {
  components: {
    AppLayout: AppLayout,
    // AuthForm
  },
  data () {
    return {
    }
  },
  // computed: {
  //   authState () {
  //     return this.$store.getters.isLoggedIn 
  //   }
  // }
}
</script>


