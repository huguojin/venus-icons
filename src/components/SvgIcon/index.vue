<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :href="iconName" />
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'SvgIcon'
})
export default class SvgIcon extends Vue {
  @Prop({ required: true, default: '' }) iconClass!: string
  @Prop({ default: '' }) className!: string

  get iconName() {
    return `#icon-${this.iconClass}`
  }
  get svgClass() {
    if (this.className) {
      return 'svg-icon ' + this.className
    } else {
      return 'svg-icon'
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1.05em;
  height: 1.05em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
