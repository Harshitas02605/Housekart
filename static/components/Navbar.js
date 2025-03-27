export default {
    template: `<nav class="navbar navbar-expand-lg navbar-light bg-light container-fluid" style="background-color: #FFE45E !important;">
      
      
    <div><h1>HouseKart</h1></div>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">


          <li class="nav-item active" v-if="islogged">
            <a class="nav-link" @click.prevent="home">🏠︎-Home </a>
          </li>

          <li class="nav-item active" v-if="islogged">
            <a class="nav-link" @click.prevent="search">⌕-Search </a>
          </li>

          <li class="nav-item active" v-if="islogged">
            <a class="nav-link" @click.prevent="summary">🧾-Summary </a>
          </li>

          <li class="nav-item active" v-if="islogged">
                <a class="nav-link" @click.prevent="logout">Logout</a>
            </li>

          
            <li class="nav-item active" v-if="!islogged && ['/', '/create_user'].includes($route.path)">
                <a class="nav-link" @click.prevent="login">Login</a>
            </li>

            <li class="nav-item active" v-if="!islogged && ['/user_login', '/'].includes($route.path)">
                <a class="nav-link" @click.prevent="signup">Sign up</a>
            </li>
          
        </ul>
      </div>
    </nav>`,
    data(){
        return{
            role: localStorage.getItem('role'),
            islogged: localStorage.getItem('auth-token')
    }},
    methods : {
        async home() {
            if (this.role == 'admin') {
                await this.$router.push('/admin_dashboard');
              } else if (this.role == 'customer') {
                await this.$router.push('/customer_home');
              } else if (this.role == 'serviceprofessional') {
                await this.$router.push('/serviceprofessional_dashboard');
              } else {
                this.$root.showFlash('Access Denied!', 'alert-danger');
                localStorage.clear();
                this.$router.push('/user_login');
              }
        },
        async search() {
            try {
              console.log(this.role);
          
              if (!this.role) {
                this.role = await localStorage.getItem('role'); // Ensure role is fetched
              }
          
              if (this.role === 'admin') {
                await this.$router.push('/admin_search');
              } else if (this.role === 'customer') {
                await this.$router.push('/customer_search');
              } else if (this.role === 'serviceprofessional') {
                await this.$router.push('/professional_search');
              } else {
                this.$root.showFlash('Access Denied!', 'alert-danger');
                localStorage.clear();
                await this.$router.push('/user_login');
              }
            } catch (error) {
              console.error('Error in search navigation:', error);
            }
          }
          
          
        ,
        async summary() {
            {
                if (this.role == 'admin') {
                    await this.$router.push('/admin_summary');
                  } else if (this.role == 'customer') {
                    await this.$router.push('/customer_summary');
                  } else if (this.role == 'serviceprofessional') {
                    await this.$router.push('/professional_summary');
                  } else {
                    this.$root.showFlash('Access Denied!', 'alert-danger');
                    localStorage.clear();
                    this.$router.push('/user_login');
                  }
            }
        },
        async logout(){
            localStorage.clear();
            await this.$router.push('/user_login');
        },
        async login() {
            localStorage.clear();
            await this.$router.push('/user_login')
        },
        
        async signup() {
            localStorage.clear();
            await this.$router.push('/create_user')
        }
    }
}
