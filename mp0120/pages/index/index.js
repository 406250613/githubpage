// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navLists:[
      {name:'最新资源',checked:true},
      { name: '网站建设', checked: false },
      { name: 'app开发', checked: false },
      { name: '微信开发', checked: false },
      { name: '软件开发', checked: false }
    ]
  },
  switchNav(e) {  //按钮组切换
    var id = e.currentTarget.dataset.id
    console.log(id)
    for (var i = 0; i < this.data.navLists.length; i++) {
      var all = 'navLists[' + i + '].checked'
      this.setData({
        [all]: false
      })

      if (id == i) {
        console.log(id)
        console.log(this.data.navLists[id].checked)
        var _checked = 'navLists[' + id + '].checked'

        this.setData({
          [_checked]: true
        })
      }
   }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})