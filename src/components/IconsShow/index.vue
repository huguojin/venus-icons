<template>
  <div class="icons-container">
    <div class="topArea">
      <SearchBar @search="search" />
      <el-badge :value="iconZip.length" :max="99" class="item">
        <el-button @click="openFold" type="text"><svg-icon icon-class="ic-folder-line"/></el-button>
      </el-badge>
    </div>
    <div class="iconArea">
      <div v-for="(item, index) in Object.keys(allIcons)" :key="index">
        <h2 class="groups-title" :id="item">{{ item }}</h2>
        <div class="icons-content">
          <div
            class="icon-item"
            v-for="(singleIcon, IconIndex) in allIcons[item]"
            :key="index + '_' + IconIndex"
            @click="showDialog(singleIcon.file, singleIcon.src)"
          >
            <svg-icon
              :class-name="className[Math.floor(Math.random() * className.length)]"
              :icon-class="singleIcon.file"
            />
            <span>{{ singleIcon.file }}</span>
            <el-button
              title="添加至文件夹"
              type="text"
              class="addIcon"
              @click.stop="addFold(singleIcon.src, singleIcon.file)"
            >
              <svg-icon icon-class="ic-plus-square" />
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <ul class="navBar">
      <li v-for="item in Object.keys(allIcons)" :key="item">
        <el-tooltip :content="item" placement="left">
          <a :href="'#' + item" @click="selected('list_' + item)" :id="'list_' + item" class="singleNav">{{ item }}</a>
        </el-tooltip>
      </li>
    </ul>
    <!-- 单个图标弹窗 -->
    <el-dialog title="Icon详情" :visible.sync="dialogVisible" width="35%" top="30vh">
      <div class="dialog-content">
        <div class="leftIcon">
          <svg-icon :icon-class="currentIconName" />
        </div>
        <div class="rightContent">
          <div class="topTitle">
            <span>{{ currentIconName }}</span>
            <el-button
              @click="addFold(currentIconSrc, currentIconName)"
              title="添加至文件夹"
              type="text"
              style="padding:0"
              ><svg-icon icon-class="ic-folder-add-fill"
            /></el-button>
          </div>
          <div>
            <el-input v-model="currentIcon">
              <template slot="append">
                <el-button type="primary" title="复制" @click="handleIconsName($event)">
                  <span style="color:#409EFF">
                    复制
                  </span>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleIcons($event)">复制SVG</el-button>
        <el-button type="primary" @click="downloadSingleSvg">下载SVG</el-button>
      </span>
    </el-dialog>
    <!-- 文件夹弹窗 -->
    <el-dialog title="已选图标" :visible.sync="foldVisible" width="35%" top="20vh">
      <div class="icons-content fold-icons">
        <div class="icon-item" v-for="(item, index) in foldIcons" :key="index">
          <svg-icon :class-name="className[Math.floor(Math.random() * className.length)]" :icon-class="item" />
          <span>{{ item }}</span>
          <el-button title="删除" type="text" class="addIcon" @click.stop="deleteIcon(item)">
            <svg-icon style="color:rgb(235, 88, 88)" icon-class="ic-delete-bin-5-line" />
          </el-button>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" :disabled="iconZip.length === 0" @click="downFoldIcons">下载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import clipboard from '@/utils/clipboard'
import JsZip from 'jszip'
import { saveAs } from 'file-saver'
import SearchBar from './serachBar.vue'
const res = require.context('../../icons/svg', true)
const list = res.keys().reduce((pre, cur) => {
  const [_, dir, file] = cur.match(/^\.\/(.*)\/(.*).svg$/) || []
  const src = res(cur)
    .default.content.replace(/symbol/g, 'svg')
    .replace(/id="[^"]*"/g, '')
  if (!pre[dir]) pre[dir] = []
  pre[dir].push({ file, src })

  return pre
}, {} as { [propName: string]: any })
@Component({
  name: 'Icons',
  components: {
    SearchBar
  }
})
export default class Icons extends Vue {
  @Prop({ default: '' }) keyWords!: string
  private className: string[] = ['red', 'orange', 'green', 'skeBlue']
  private iconZip: string[] = []
  private foldIcons: string[] = []
  private dialogVisible = false
  private foldVisible = false
  private allIcons: any = ''
  private storageIcons: any = ''
  private currentIcon = ''
  private currentIconName = ''
  private currentIconSrc = ''

  mounted() {
    this.getAllIcons()
  }
  // 获取所有的图标
  private getAllIcons() {
    this.allIcons = { ...list }
    this.storageIcons = { ...list }
  }
  // 复制图标
  handleIcons(event: any) {
    clipboard(this.currentIconSrc, event)
  }
  // 复制使用方式
  handleIconsName(event: any) {
    clipboard(this.currentIcon, event)
  }
  // 搜索
  search(keyWords: string) {
    const filterIcons = Object.values(this.storageIcons).map((item: any) => {
      item = item.filter((singleIcon: any) => {
        return singleIcon.file.includes(keyWords)
      })
      return item
    })
    this.allIcons = filterIcons.reduce((pre: any[], cur: any[], index: number) => {
      const currentKey: any = Object.keys(this.storageIcons)[index]
      pre[currentKey] = cur
      return pre
    }, {} as { [propName: string]: any[] })
  }
  // 锚点选中
  selected(id: string) {
    const allNavList: any = document.getElementsByClassName('singleNav')
    allNavList.forEach((item: any) => {
      item.style.backgroundColor = 'transparent'
      item.style.color = 'orange'
    })
    const tagA: any = document.getElementById(id)
    tagA.style.backgroundColor = '#1175d3'
    tagA.style.color = '#fff'
  }
  // 点击图标
  showDialog(file: string, src: string) {
    this.currentIcon = `<svg-icon icon-class="${file}" />`
    this.currentIconName = file
    this.currentIconSrc = src
    this.dialogVisible = true
  }
  // 添加至文件夹
  addFold(src: string, file: string) {
    if (this.iconZip.indexOf(src) === -1) {
      this.iconZip.push(src)
    }
    if (this.foldIcons.indexOf(file) === -1) {
      this.foldIcons.push(file)
    }
  }
  // 点击文件夹
  openFold() {
    this.foldVisible = true
  }
  // 删除文件夹中的图标
  deleteIcon(file: string) {
    const index = this.foldIcons.indexOf(file)
    this.foldIcons.splice(index, 1)
    this.iconZip.splice(index, 1)
  }
  // 下载单个svg
  downloadSingleSvg() {
    const blob = new Blob([this.currentIconSrc], {})
    saveAs.saveAs(blob, this.currentIconName + '.svg')
  }
  // 下载文件夹中的icons
  downFoldIcons() {
    const zip = new JsZip()
    zip.folder('venus-icons')
    this.iconZip.forEach((item: any, index: number) => {
      zip.file(`venus-icons/${this.foldIcons[index]}.svg`, item)
    })
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'venus-icons.zip')
    })
  }
}
</script>
<style lang="scss">
.icons-container {
  .el-input-group__append {
    background-color: #fff !important;
    padding: 0 5px !important;
  }
}
</style>
<style lang="scss" scoped>
.icons-container {
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
  padding: 0 135px 0 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-top: 24px;
  // 头部区域
  .topArea {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 8px;
    .svg-icon {
      font-size: 24px;
    }
  }
  // 整个icons区域
  .iconArea {
    flex-grow: 1;
    overflow: auto;
    .groups-title {
      font-size: 22px;
      color: orange;
      padding-bottom: 2px;
      border-bottom: 1px solid rgb(211, 208, 208);
      line-height: 45px;
    }
  }
  // 右侧定位栏
  .navBar {
    position: fixed;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid #e7e7e7;
    border-bottom: none;
    background-color: #fff;
    border-radius: 10px;
    li {
      width: 120px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e7e7e7;
      text-align: center;
      a {
        font-size: 14px;
        font-weight: bold;
        color: orange;
        height: 100%;
        width: 100%;
        padding: 0 10px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    li:hover {
      background-color: #73c9e5;
      a {
        color: #fff;
      }
    }
    .isActive {
      a {
        color: #fff;
      }
      background-color: #1175d3;
    }
  }
  // 单个图标详情
  .dialog-content {
    overflow: hidden;
    display: flex;
    .leftIcon {
      flex-shrink: 0;
      height: 80px;
      width: 80px;
      margin-right: 24px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      border: 1px solid #e7e7e7;
      .svg-icon {
        font-size: 52px;
      }
    }
    .rightContent {
      flex-grow: 1;
      padding-top: 5px;
      .topTitle {
        height: 40px;
        span {
          font-size: 18px;
          font-weight: bold;
        }
        .el-button {
          float: right;
          .svg-icon {
            font-size: 24px;
          }
        }
      }
    }
  }
  // 单个图标样式
  .icons-content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .icon-item {
      margin: 10px;
      height: 80px;
      text-align: center;
      width: 120px;
      color: #24292e;
      cursor: pointer;
      position: relative;
      .addIcon {
        position: absolute;
        right: 0;
        top: 0;
        padding: 0;
        display: none;
      }
      .svg-icon {
        font-size: 20px !important;
      }
    }
    .icon-item:hover {
      border: 1px solid #0080ff;
      .addIcon {
        display: inline-block;
      }
    }
    span {
      display: block;
      margin-top: 10px;
    }
  }
  // 文件夹弹窗
  .fold-icons {
    max-height: 500px;
    overflow: auto;
  }
}
</style>
