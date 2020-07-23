<template>
  <div class="serachBar">
    <i style="margin-right:8px;display:inline-block;font-weight:600;font-size:18px;color:orange">搜索:</i>
    <el-input
      v-model="keyWords"
      placeholder="请输入图标名称按回车键进行搜索"
      style="width:300px;"
      @keydown.native.enter="startSearch"
    ></el-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
@Component({
  name: 'SearchBar'
})
export default class SearchBar extends Vue {
  private keyWords = ''
  @Watch('keyWords')
  noSearchParams(val: string) {
    if (!val) this.startSearch()
  }
  startSearch() {
    this.$emit('search', this.keyWords)
  }
}
</script>
