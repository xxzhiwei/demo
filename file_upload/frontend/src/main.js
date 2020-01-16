import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// import store from './store'

// import {
//   Button,
//   Card,
//   Table, TableColumn,
//   Pagination,
//   Upload,
//   Dropdown, DropdownItem, DropdownMenu,
//   Icon,
//   Link,
//   Breadcrumb, BreadcrumbItem,
//   Dialog,
//   Tabs, TabPane,
//   Form, FormItem,
//   Image,
//   Row, Col,
//   Input, Switch,
//   Select, Option,
//   Drawer,
// } from 'element-ui'

// Vue.component(Button.name, Button)
// Vue.component(Card.name, Card)
// Vue.component(Table.name, Table)
// Vue.component(TableColumn.name, TableColumn)
// Vue.component(Pagination.name, Pagination)
// Vue.component(Upload.name, Upload)
// Vue.component(Dropdown.name, Dropdown)
// Vue.component(DropdownMenu.name, DropdownMenu)
// Vue.component(DropdownItem.name, DropdownItem)
// Vue.component(Icon.name, Icon)
// Vue.component(Link.name, Link)
// Vue.component(Breadcrumb.name, Breadcrumb)
// Vue.component(BreadcrumbItem.name, BreadcrumbItem)
// Vue.component(Dialog.name, Dialog)
// Vue.component(Tabs.name, Tabs)
// Vue.component(TabPane.name, TabPane)
// Vue.component(Form.name, Form)
// Vue.component(FormItem.name, FormItem)
// Vue.component(Image.name, Image)
// Vue.component(Row.name, Row)
// Vue.component(Col.name, Col)
// Vue.component(Input.name, Input)
// Vue.component(Switch.name, Switch)
// Vue.component(Select.name, Select)
// Vue.component(Option.name, Option)
// Vue.component(Drawer.name, Drawer)

import '@/styles/base.stylus'

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
