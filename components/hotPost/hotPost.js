let utils = require('../../utils/util')
Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    graphics: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    toPostDetail(e) {
      utils.toPostDetail(e.currentTarget.dataset.item)
    },
  },
})