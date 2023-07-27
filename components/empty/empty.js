let utils = require('../../utils/util')
Component({
  properties: {
    img: {
      type: String,
      value: '/img/entry_image_default.png',
    },
    imgWidth: {
      type: Number,
      value: 150
    },
    imgHeight: {
      type: Number,
      value: 120
    },
    tip: {
      type: String,
      value: '这里空空的什么都没有呢...',
    },
  },
})