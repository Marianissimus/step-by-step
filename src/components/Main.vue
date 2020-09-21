<template>
  <section>
    <navbar />
    <h2>Follow the steps</h2>
    <div class="toolbar">
      <button @click="$router.push('edit')" class="tabButton">
        <svg class="icon editIcon " />
        Edit
      </button>
      <button @click="goBack" v-if="currentStep > 1" class="tabButton">
        <svg class="icon undoIcon " />
        Step back
      </button>
      <button @click="restart" v-if="currentStep > 1" class="tabButton">
      <svg class="icon resetIcon " />
        Restart
      </button>
    </div>
    <div class="stepsContainer">
      <ol>
        <li v-for="step in steps" :key="step.id" :class="step.id === currentStep ? 'enabled': 'disabled'">
          <span>{{ step.name }}</span>
          Enabled: <span> {{ step.isEnabled }}</span>
          && checked: <span> {{ step.isChecked }}</span>
          <input type="checkbox" id="completed" name="completed" v-model="step.isChecked" @change.prevent="toggleCorrectListItems">
        </li>
      </ol>
    </div>
  </section>
</template>

<script>
import { auth } from '@/firebaseInit'
import { db } from '@/firebaseInit'
import Navbar from './Navbar'

export default {
  components: {
    'navbar': Navbar
  },
  data () {
    return {
      steps: [],
      currentStep: null
    }
  },
  computed: {
    user () {
      return auth.currentUser.email
    }
  },
  created () {
    db.collection("steps").doc(this.user)
    .get()
    .then((doc) => {
      if (doc.exists) {
          let obj = doc.data()
          for (let key in obj) {
            let processedObj = obj[key]
            processedObj.isEnabled = false // make default disabled
            processedObj.isChecked = false // make default unchecked
            this.steps.push(processedObj)
          }
          // enable only the first item
          this.currentStep = this.steps[0].id
      } else {
        console.log("No such document!");
      }
    })
    .catch(error => console.log("Error getting document:", error) )
  },
  methods: {
    toggleCorrectListItems () {
      this.currentStep += 1
      if (this.currentStep > this.steps.length) {
        setTimeout(() => {
          if (confirm ('Finished. Start again?')) {
            this.restart()
          }
        }, 0)
      }
    },
    goBack () {
      if (this.currentStep > 1) {
        this.currentStep -= 1
        this.steps.find(el => el.id === this.currentStep).isChecked = false
      }
    },
    restart () {
      this.currentStep = this.steps[0].id
      this.steps.forEach(el => {
        el.isChecked = false
        el.isEnabled = false
      })
    }
  }
}
</script>
