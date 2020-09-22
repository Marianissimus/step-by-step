<template>
  <section>
    <navbar />
    <h2>Steps editor</h2>
    <div class="toolbar">
     <button class="tabButton" @clicksper ="addStep = true">
       <svg class="icon addIcon" />
        Add step
      </button>
     <button class="tabButton" @click="importJson = true">
      <svg class="icon importIcon " />
      Import JSON</button>
     <button class="tabButton" @click="exportToJsonFile">
      <svg class="icon exportIcon " />
      Export JSON
     </button>
     <button class="tabButton" @click="reset">
      <svg class="icon resetIcon " />
      Reset
    </button>
    </div>
    <div class="utilities" style="margin-top: 20px;">
      <form
        v-if="addStep"
        novalidate="true"
        id="contactForm"
        @submit.prevent="saveStep"
        >
          <label for="id">Position</label>
          <select v-model.number="step.id">
          <option v-for="option in 20" :key="option">
            {{ option }}
          </option>
          </select>
          <label for="name">Name</label>
          <input v-model="step.name" type="text" name="name" id="name"/>
        <button type="submit">Add</button>
        <button @click="addStep = false">Cancel</button>
      </form>
      <form v-if="importJson">
        <label for="importJson">Import JSON:</label>
        <input type="file" id="importJson" name="importJson" ref="jsonInput" accept="application/JSON" @change="loadJSON">
        <button @click="cancelImportJson">Cancel</button>
      </form>
    </div>
    <ol v-if="steps.length">
      <li v-for="step in sortedSteps" :key="step.id + step.name">
        {{ step }}
        <button
          v-if="step.id !== 1"
          @click="moveStep('up', step.id)">
          <svg class="icon arrowUpIcon" />
        </button>
        <button
          v-if="step.id !== steps.length"
          @click="moveStep('down', step.id)">
          <svg class="icon arrowDownIcon" />
        </button>
        <button @click="removeStep(step.id)">
          <svg class="icon deleteIcon" />
        </button>
        <upload-img :id="step.id" />
      </li>
    </ol>
    <span v-else>
      No steps defined. Start now?
      <button @click="startSteps">Yes</button>
    </span>
     <div v-if="steps.length">
      <button class="large" @click="saveSteps">
        <svg class="icon saveIcon " />
        Save Steps
      </button>
    </div>
  </section>
</template>

<script>
import { auth } from '@/firebaseInit'
import { db } from '@/firebaseInit'
import UploadImg from './UploadImg'
import Navbar from './Navbar'

/* I didn't use more firebase methods to set/update the collection so as to:
1. be able to quickly drop firebase and switch to another solution and
2. have better client-side control and quick access to the logic */

export default {
  components: {
    'navbar': Navbar,
    'upload-img': UploadImg
  },
  data () {
    return {
      steps: [],
      addStep: false,
      importJson: false,
      step: this.getNewStep(),
      initialSteps: []
    }
  },
  computed: {
    sortedSteps () {
      return this.steps.slice().sort((a, b) => a.id - b.id )
    },
    user () {
      return auth.currentUser.email
    }
  },
  created () {
    this.getDbSteps()
  },
  methods: {
    getDbSteps () {
      this.steps = []
      db.collection("steps").doc(this.user)
      .get()
      .then((doc) => {
        if (doc.exists) {
            let obj = doc.data()
            for (let key in obj) {
              this.steps.push(obj[key])
            }
            this.initialSteps = JSON.parse(JSON.stringify(this.steps))
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
      })
      .catch(error => console.log("Error getting document:", error) )
    },
    getNewStep () {
      return {
        name: null,
        id: 0
      }
    },
    startSteps () {
      this.addStep = true
    },
    saveStep () {
      // avoid duplicate id-s (position)
      let duplicateID = this.steps.find(el => el.id === this.step.id)
      if (duplicateID){
        if (confirm('Duplicate id found. Replace and move existing to bottom?')) {
          duplicateID.id = this.steps.length + 1
        } else {
          this.step.id = this.steps.length + 1
        }
      }
      this.steps.push(this.step)
      this.step = this.getNewStep()
    },
    moveStep (dir, currentStepId) {
      let currentStep = this.steps.find(el => el.id === currentStepId)
      let targetStep
      if (dir === 'up') {
        targetStep = this.steps.find(el => el.id === currentStepId -1)
        currentStep.id -= 1
        setTimeout(() => targetStep.id += 1, 0)
      } else {
        targetStep = this.steps.find(el => el.id === currentStepId + 1)
        currentStep.id += 1
        setTimeout(() => targetStep.id -= 1, 0)
      }
    },
    removeStep (id) {
      let currentIndex = this.steps.findIndex(el => el.id === id)
      this.steps.splice(currentIndex, 1)
      this.orderIds()
    },
    orderIds () {
      // re-map all steps to have a consecutive set of id-s
      let arr = []
      for (let i = 0; i < this.sortedSteps.length; i++ ) {
        arr[i] = {
          name: this.sortedSteps[i].name,
          id: i + 1,
          showUpload: false,
          image: null
        }
      }
      this.steps = arr
    },
    saveSteps () {
      this.orderIds()
      db.collection("steps").doc(this.user).set({...this.steps})
      if (this.importJson && this.$refs.jsonInput.value) {
        this.$refs.jsonInput.value = ''
      }
      this.importJson = false
      this.addStep = false
    },
    exportToJsonFile() {
      let dataStr = JSON.stringify(this.steps);
      let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      let exportFileDefaultName = 'steps.json';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
    loadJSON () {
      let file = this.$refs.jsonInput.files[0];
      // if(!file || file.type !== 'application/JSON') return;
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload =  evt => {
        let  incoming = evt.target.result;
        try {
          let incomingJSON = JSON.parse(incoming)
          this.steps = incomingJSON
        } catch(e) {
          alert("Sorry, your file doesn't appear to be valid JSON data.")
          this.$refs.jsonInput.value = ''
        }
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    cancelImportJson () {
      this.importJson = false
      this.$refs.jsonInput.value = ''
      this.getDbSteps()
    },
    reset () {
      this.steps = JSON.parse(JSON.stringify(this.initialSteps))
    }
  }
}
</script>
