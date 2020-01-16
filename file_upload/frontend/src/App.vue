<script>
// import { mapActions } from 'vuex'
export default {
  // methods: {
  //   ...mapActions(['generateRoutes']),
  // },
  // created() {
  //   this.generateRoutes()
  // },
  render() {
    return (
      <div id="root">
        <router-view />
      </div>
    )
  },
}
</script>

<style lang="stylus">
body
  background-color #F9F9F9
  // background url('https://xxzhiwei.oss-cn-beijing.aliyuncs.com/development/IMG_0324.jpg') no-repeat center center fixed
  // background-size cover
  // position relative
  // &::before
  //   position absolute
  //   content ''
  //   top 0
  //   left 0
  //   // width 100%
  //   bottom 0
  //   right 0
  //   background url('https://xxzhiwei.oss-cn-beijing.aliyuncs.com/development/IMG_0324.jpg') no-repeat center center fixed
  //   background-size cover
#root
  height 100%
</style>
