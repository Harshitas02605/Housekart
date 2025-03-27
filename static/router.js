import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Professional from "./components/Professional.js";
import CustomerSignup from "./components/CustomerSignup.js";
import ProfessionalSignup from "./components/ProfessionalSignup.js";
import CreateUser from "./components/CreateUser.js";
import AdminHome from "./components/AdminHome.js";
import CustomerHome from "./components/CustomerHome.js";
import ProfessionalHome from "./components/ProfessionalHome.js";
import AdminSearch from "./components/AdminSearch.js";
import CustomerSearch from "./components/CustomerSearch.js";
import ProfessionalSearch from "./components/ProfessionalSearch.js";
import AdminSummary from "./components/AdminSummary.js";
import CustomerSummary from "./components/CustomerSummary.js";
import ProfessionalSummary from "./components/ProfessionalSummary.js";
import ServiceDetails from "./components/ServiceDetails.js";
import ServiceRequestRemarks from "./components/ServiceRequestRemarks.js";
import NotApprovedProfessional from "./components/NotApprovedProfessional.js";
import AddService from "./components/AddService.js";
import EditServiceCustomer from "./components/EditServiceCustomer.js";


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/user_login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/professional_dashboard',
    name: 'Professional',
    component: Professional
  },
  {
    path: '/admin_dashboard',
    name: 'AdminHome',
    component: AdminHome,
    beforeEnter: (to, from, next) => {
      const userRole = localStorage.getItem('role');
      if (userRole == 'admin') {
        next();
      } else {
        next('/user_login');
      }
    }
  },
  {
    path: '/serviceprofessional_dashboard',
    name: 'ProfessionalHome',
    component: ProfessionalHome,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'serviceprofessional') {
          next();
        } else {
          next('/user_login');
        }
      }
  },
  {
    path: '/customer_home',
    name: 'CustomerHome',
    component: CustomerHome,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'customer') {
          next();
        } else {
          next('/user_login');
        }
       }
    
  },
  {
    path: '/customer_signup',
    name: 'CustomerSignup',
    component: CustomerSignup,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'customer') {
          next();
        } else {
          next('/user_login');
        }
      }
  },
  {
    path: '/professional_signup',
    name: 'ProfessionalSignup',
    component: ProfessionalSignup,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'serviceprofessional') {
          next();
        } else {
          next('/user_login');
        }
      }
  },
  {
    path: '/create_user',
    name: 'CreateUser',
    component: CreateUser,
  },
  {
    path: "/admin_search",
    name: 'AdminSearch',
    component: AdminSearch,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'admin') {
          next();
        } else {
          next('/user_login');
        }
      }
  },
  {
    path: "/customer_search",
    name: 'CustomerSearch',
    component: CustomerSearch,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'customer') {
          next();
        } else {
          next('/user_login');
        }
      }
},
{
    path: "/professional_search",
    name: 'ProfessionalSearch',
    component: ProfessionalSearch,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'serviceprofessional') {
          next();
        } else {
          next('/user_login');
        }
      }
},
{
    path: "/admin_summary",
    name: 'AdminSummary',
    component: AdminSummary,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'admin') {
          next();
        } else {
          next('/user_login');
        }
      }
},
{
    path: "/customer_summary",
    name: 'CustomerSummary',
    component: CustomerSummary,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'customer') {
          next();
        } else {
          next('/user_login');
        }
      }
},
{
    path: "/professional_summary",
    name: 'ProfessionalSummary',
    component: ProfessionalSummary,
    beforeEnter: (to, from, next) => {
        const userRole = localStorage.getItem('role');
        if (userRole == 'serviceprofessional') {
          next();
        } else {
          next('/user_login');
        }
      }
},
{
    path: "/service_details",
    name: 'ServiceDetails',
    component: ServiceDetails
},

{
    path: "/approval",
    name: 'NotApprovedProfessional',
    component: NotApprovedProfessional
},
{
    path: "/addservice",
    name: 'AddService',
    component: AddService
},
{
  path: "/addserviceremarks/:serviceid",
  name: 'ServiceRequestRemarks',
  component: ServiceRequestRemarks
},
{
  path: "/editservice/:serviceid",
  name: 'EditServiceCustomer',
  component: EditServiceCustomer
}
];

export default new VueRouter({
  routes
});
