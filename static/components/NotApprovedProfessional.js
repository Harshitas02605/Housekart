export default {
    template: `
      <div class="container">
        <div class="alert alert-info my-5">
          <h4>Application Under Review</h4>
          <p>Kindly wait until the Admin approves your application. You'll be notified once it's processed.</p>
          <button class="btn btn-success" @click="navigateToLogin">Proceed to Login</button>
        </div>
      </div>
    `,
    data() {
      return {}
    },
    methods: {
      navigateToLogin() {
        this.$router.push('/user_login'); // Adjust the route if necessary
      }
    }
  }
  