export default {
    template: `
      <div class="background">
        <div class="center-content container">
          <h1>Welcome to HouseKart Services</h1>
          <p>HouseKart is your all-in-one platform for seamless home services. From repairs and cleaning to plumbing, electrical work, and more, HouseKart connects you with verified professionals in your area.</p>
          <button class="btn btn-info" @click="navigateToSignup">Signup</button>
          <button class="btn btn-success" @click="navigateToLogin">Login</button>
        </div>
      </div>
    `,
    methods: {
      navigateToSignup() {
        this.$router.push('/create_user');
      },
      navigateToLogin() {
        this.$router.push('/user_login');
      }
    }
  };
  
  // Add styles using scoped tag
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: auto; /* Enable scrolling if needed */
    }
    .background {
      background-image: url('/static/warli.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .center-content {
      background-color: rgba(255, 255, 255, 0.9);
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .btn:hover {
      background-color: #0056b3;
    }
  `;
  document.head.appendChild(style);
  