<template>
  <div id="app">
    <div class="icon-content">
      <IconShow :keyWords="keyWords" ref="iconPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import IconShow from '@/components/IconsShow/index.vue'

@Component({
  components: {
    IconShow
  }
})
export default class App extends Vue {
  private keyWords = ''
  startSearch() {
    ;(this.$refs.iconPage as any).search()
  }
}
</script>
<style lang="scss" scoped>
#app {
  overflow: hidden;
  .icon-content {
    height: 100%;
  }
}
</style>
