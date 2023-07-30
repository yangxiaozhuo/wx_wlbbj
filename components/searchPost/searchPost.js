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
      console.log(e.currentTarget.dataset.item);
      utils.toPostDetail(e.currentTarget.dataset.item.content)
    },
  },
})