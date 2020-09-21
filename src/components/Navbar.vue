<template>
  <nav>
    <router-link to="main">Main</router-link> |
    <router-link to="edit">Editor</router-link>
    <span>| </span>
    <a @click="logout" style="margin-left: 10px;">Log out</a>
  </nav>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  methods: {
    logout () {
      firebase.auth().signOut().catch(function(error) {
        var errorCode = error.code
        var errorMessage = error.message
        if (errorMessage) console.log(`Error code: ${errorCode} with message: ${errorMessage}`)
      })
      .then (()=> {
        this.$router.replace('/')
      })
    }
  }
}
</script>

<style lang="scss">
nav {
  width: calc(100% - 2em);
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  a {
    flex: 0 0 80px;
    text-decoration: none;
    cursor: pointer;
    color: inherit;
  }
}
</style>