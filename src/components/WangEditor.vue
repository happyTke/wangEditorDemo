<template>
  <div :id="id" class="editorClass"></div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'WangEditor',
  mixins: [],
  components: {},
  props: {
    value: {
      type: String
    },
    id: {
      type: String
    },
    /**
       * 不可用
       * true false
       */
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    /**
       * 配置编辑区域的 z-index
       */
    zindex: {
      type: Number,
      default () {
        return 10000
      }
    },
    /**
       * 配置字体颜色、背景色
       */
    colors: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      editor: null // 富文本实例
    }
  },
  computed: {},
  watch: {
    value (val) {
      this.editor.txt.html(val)
    },
    disabled (val) {
      if (val) {
        this.setEditable(false)
      } else {
        this.setEditable(true)
      }
    }
  },
  created () {
  },
  mounted () {
    this.initEditor()
  },
  destroyed () {
  },
  methods: {
    /**
       * 处理富文本里的图片宽度自适应
       * 1.去掉img标签里的style、width、height属性
       * 2.img标签添加style属性：max-width:100%;height:auto
       * 3.修改所有style里的width属性为max-width:100%
       * 4.去掉<br/>标签
       * @param html
       * @returns {void|string|*}
       */
    formatRichText (html) { // 控制小程序中图片大小
      let newContent = String(html).replace(/<img[^>]*>/gi, function (match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '')
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '')
        return match
      })
      newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
        match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;')
        return match
      })
      newContent = newContent.replace(/<br[^>]*\/>/gi, '')
      newContent = newContent.replace(/\<img/gi,
        '< img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"')
      return newContent
    },
    /**
       * 设置是否可编辑
       * @param bool true 开启 false 禁用
       */
    setEditable (bool) {
      this.editor.$textElem.attr('contenteditable', bool)
    },
    /**
       * 初始化编辑器
       */
    initEditor () {
      // 创建编辑器
      this.editor = new E('#' + this.id)
      this.editor.customConfig.onchange = (html) => {
        // html 即变化之后的内容 预防xxs攻击
        this.$emit('input', this.$xss(this.formatRichText(html)))
      }
      // 自定义菜单配置
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]

      // 配置编辑区域的 z-index
      this.zindex !== 10000 && (this.editor.customConfig.zIndex = this.zindex)
      // 配置字体颜色、背景色
      this.colors.length > 0 && (this.editor.customConfig.colors = this.colors)
      // 配置表情和字体 请查看官网： https://www.kancloud.cn/wangfupeng/wangeditor3/460259

      /**
         * 上传图片配置
         */
      // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
      // this.editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
      this.editor.customConfig.uploadImgServer = '/upload' // 上传图片到服务器
      // 将图片大小限制为 3M
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
      // 限制一次最多上传 5 张图片
      this.editor.customConfig.uploadImgMaxLength = 5
      this.editor.customConfig.uploadFileName = 'yourFileName'
      // 自定义提示方法
      // 上传图片的错误提示默认使用alert弹出，你也可以自定义用户体验更好的提示方式
      this.editor.customConfig.customAlert = (info) => {
        // info 是需要提示的内容
        alert(info)
      }
      this.editor.create()
    }
  }
}
</script>

<style lang="scss" scoped>
  /* 设置最大显示100% */
  .editorClass {
    :v-deep img {
      max-width: 100%;
    }
  }
</style>
