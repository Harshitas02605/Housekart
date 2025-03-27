// Vue.config.devtools = true;

import router from "./router.js";
import Navbar from "./components/Navbar.js";

const publicPages = ['/create_user', '/user_login','/'];

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth-token');
  
  if (!isAuthenticated && !publicPages.includes(to.path)) {
    next('/user_login');
  } else {
    next();
  }
});

new Vue({
  el: '#app',
  data() {
    return {
      flashMessage: '',
      flashClass: '',
      has_changed: true,
    };
  },
  methods: {
    showFlash(message, type = 'alert-success') {
      this.flashMessage = message;
      this.flashClass = type;
      setTimeout(() => {
        this.flashMessage = '';
      }, 3000);
    }
  },
  template: `
  
    <div>
    
      
       <div v-if="flashMessage" :class="['alert', flashClass]" style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000;">
        {{ flashMessage }}
      </div>
      <Navbar :key='has_changed'/>
      <router-view/>
    </div>
  `,
  router,
  components: {
    Navbar
  },
  watch: {
    $route(to, from) {
      this.has_changed = !this.has_changed;
    }
  }
});
