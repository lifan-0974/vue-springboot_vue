import Vue from 'vue'
import Router from 'vue-router'
import LeaverAll from '@/components/LeaverAll'
import logingo from '@/components/logingo'
import index from '@/components/index'
import upstatic from '@/components/upstatic'
import update from '@/components/update'
import insert from '@/components/insert'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      show: false,
      component: logingo
    },
    {
      path: '/login',
      name: '登录',
      show: false,
      component: logingo
    },
    {
      path: '/index',
      name: '请假管理',
      show: true,
      component: index,
      children: [
        {
          path: '/LeaverAll',
          name: '查询请假信息',
          show: true,
          component: LeaverAll
        },
        {
          path: '/upstatic',
          name: '主管审核',
          show: true,
          component: upstatic
        },
        {
          path: '/update',
          name: '修改请假信息',
          show: true,
          component: update
        },
        {
          path: '/insert',
          name: '写假条',
          show: true,
          component: insert
        }
      ]

    }
  ]

})
router.beforeEach((to, from, next) => {
  let user=sessionStorage.getItem('user');

  if (to.path=='/login' ) {
    // 判断该路由是否需要登录权限

    if (user) {  // 通过vuex state获取当前的token是否存在
      next({path: '/'})
    } else {
      next()
    }

  } else {
   if (!user){
    next({path: '/login'})
   }else {
     next();
   }
  }
})

export default router





