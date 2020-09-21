<template>
  <section>
    <h1>STEP by STEP</h1>
    <img :src="require('@/assets/images/nkotb.gif')" style="width: 200px; height: auto;"/>
    <form novalidate="true"
      id="loginForm"
      @submit.prevent="login"
      class="form">
      <div class="form-row">
        <label for="email">Email</label>
        <input v-model="user.email" type="email" name="email" id="email" class="form-rowInput"/>
        <transition name="fade">
          <div class="error" v-if="errors.email">{{ errors.email }}</div>
        </transition>
      </div>
      <div class="form-row">
        <label for="password">Password</label>
        <input v-model="user.password" type="password" name="password" id="password" class="form-rowInput"/>
        <transition name="fade">
          <div class="error" v-if="errors.password">{{ errors.password }}</div>
        </transition>
      </div>
      <button type="submit" class="large">Login</button>
    </form>
  </section>
</template>

<script>
import { auth } from '@/firebaseInit'

export default {
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      errors: {
        email: null,
        password: null
      }
    }
  },
  methods: {
    login () {
      this.errors = {
        email: null,
        password: null
      }
      if (!this.user.email) {
        this.errors.email = 'Email required'
      }
      if (!this.user.password) {
        this.errors.password = 'Password required'
      }
      if (this.user.email && !this.validEmail(this.user.email)) {
        this.errors.email = 'Valid email please'
      }
      let userHasNoErrors = !Object.values(this.errors).some(x => (x !== null && x !== ''))
      if (userHasNoErrors) {
        auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(() => {
          this.$router.replace('/main')
        }).catch(error => {
          this.error = error.message
        })
        this.onCancel()
      }
    },
    onCancel () {
      this.user = {
        email: '',
        password: ''
      }
    },
    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
}
</script>
