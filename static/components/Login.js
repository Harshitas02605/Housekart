export default {
  template: `
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
  <form class="p-4 rounded shadow-lg" style="width: 350px; background-color: #fff;">
    <h2 class="text-center mb-4">Welcome Back!</h2>
    
    <div class="form-group">
      <label for="user_email">Email Address</label>
      <input type="email" class="form-control" id="user_email" placeholder="Enter your email" v-model="user_login_credentials.email">
    </div>

    <div class="form-group">
      <label for="user_password">Password</label>
      <input type="password" class="form-control" id="user_password" placeholder="Enter your password" v-model="user_login_credentials.password">
    </div>
    
    <button type="submit" class="btn btn-primary btn-block" @click.prevent='login'>Log In</button>
  </form>
</div>

  `,
  data() {
    return {
      user_login_credentials: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    async login() {
      
        const res = await fetch('/user_login_backend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.user_login_credentials)
        });
  
        const data = await res.json().catch(() => ({ message: 'Invalid response from server' }));
        console.log(data)
  
        if (res.ok) {
          localStorage.setItem('customer_id', data.customer_id);
          localStorage.setItem('professional_id', data.professional_id);
          localStorage.setItem('auth-token', data.token);
          localStorage.setItem('role', data.role);
          if (data.role == 'admin'){
          this.$router.push('/admin_dashboard');
          this.$root.showFlash('Welcome Admin!', 'alert-success');}

          else if (data.role == 'customer'){
            this.$router.push('/customer_home');}

          else if (data.role == 'serviceprofessional' && data.active){
            this.$router.push('/serviceprofessional_dashboard');
          }

          
          }
        else if (data.message == "Wrong Password" && res.status===400){
          alert('Wrong credentials, please try again!');
          setTimeout(() => {
            this.password = null;
          }, 500)

        
        }

        else if (data.message == "User not found"){
          this.$root.showFlash('No such user exit. Please signup', 'alert-warning');
          this.$router.push('/create_user');
        }

        
        else if (data.message == "Service professional not approved yet"){
          this.$root.showFlash('Kindly wait until admin approves your application!', 'alert-info');
        }


      } 
      
      
    
  }
} 