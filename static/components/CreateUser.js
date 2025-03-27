export default {
    template: `
      <form class="container" style="margin-top:10vh">
      <h1>Signup</h1>
        <div class="form-group">
          <label for="user_email">Email address</label>
          <input type="email" class="form-control" id="user_email" aria-describedby="emailHelp" placeholder="Enter email" v-model="user_signup_details.email">
        </div>
  
        <div class="form-group">
          <label for="user_password">Password</label>
          <input type="password" class="form-control" id="user_password" v-model="user_signup_details.password">
        </div>
  
        <div class="form-group">
          <label for="confirm_password">Confirm Password</label>
          <input type="password" class="form-control" id="confirm_password" v-model="confirmPassword">
          <p v-if="confirmPassword && confirmPassword !== user_signup_details.password" style="color: red;">Passwords do not match.</p>
        </div>
  
        <label>You want to sign up as a : </label>
        <div>
          <input type="radio" id="customer" value="customer" v-model="user_signup_details.role" checked>
          <label for="customer">Customer</label>
        </div>
        <div>
          <input type="radio" id="serviceprofessional" value="serviceprofessional" v-model="user_signup_details.role">
          <label for="serviceprofessional">Service Professional</label>
        </div>
        <p v-if="!user_signup_details.role" style="color: red;">Please select a role.</p>
  
        <button type="submit" class="btn btn-primary" @click.prevent="createuser" :disabled="!isFormValid">Submit</button>
      </form>
    `,
    data() {
      return {
        user_signup_details: {
          email: '',
          password: '',
          role: 'customer'
        },
        confirmPassword: ''
      };
    },
    methods: {
      async createuser() {
          const res = await fetch('/create_user_backend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.user_signup_details),
          });
          if (res.status == 200 ) {
            const data = await res.json();
            localStorage.setItem('auth-token', data.token);
            localStorage.setItem('password', data.password);
            localStorage.setItem('email',data.email)
            localStorage.setItem('role',data.role)
            localStorage.setItem('user_id',data.user_id)
            this.$root.showFlash('Registered, please fill up other details!', 'info');
          
            if (localStorage.getItem('role') == 'customer') {
              this.$router.push('/customer_signup');
            } else if (localStorage.getItem('role') == 'serviceprofessional') {
              this.$router.push('/professional_signup');
            }
          } else if (res.status == 400) {
            this.$root.showFlash('User already exist. Kindly log-in with your credentials!', 'alert-warning');
            this.$router.push('/user_login');

          }
        } 
    },
    computed: {
        isFormValid() {
          return (
            this.user_signup_details.email &&
            this.user_signup_details.password &&
            this.confirmPassword &&
            this.user_signup_details.password === this.confirmPassword &&
            this.user_signup_details.role
          );
        }
      }
  };
  