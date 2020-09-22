<template>
  <div>
    here i am
    {{ id }} {{ showUpload }}
    <button v-if="!imgPreview" @click="showUpload = !showUpload">Add image</button>
    <input v-if="showUpload" type="file" @change="previewImage" accept="image/*" >
    <br />
    <img :src="imgPreview" style="width: 200px; height: auto; margin: 10px auto" />
    <br />
    <button v-if="imgPreview" @click="saveImg">Select</button>
    <button v-if="imgPreview" @click="cancelImg">Cancel</button>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      showUpload: false,
      imgPreview: null
    }
  },
  methods: {
    previewImage () {
      let imageData = event.target.files[0]
      if (imageData) {
        this.imgPreview = URL.createObjectURL(imageData)
      }
    },
    saveImg () {
      console.log(111)
    },
    cancelImg () {
      this.imgPreview = null
      this.showUpload = false
    }
  }
}
</script>