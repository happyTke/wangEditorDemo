<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <wang-editor id="editor1" v-model="content"></wang-editor>
  </div>
</template>

<script>
// @ is an alias to /src
import WangEditor from '@/components/WangEditor.vue'

export default {
  name: 'Home',
  data () {
    return {
      content: ''
    }
  },
  components: {
    WangEditor
  }
}
</script>
