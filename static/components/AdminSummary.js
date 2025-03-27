export default {
    template: `<div :style="{ background: '#7FC8F8', height: '87vh', width: '100%', margin: '5px', padding: '10px' }">

      <div class="container">
        <h2 class="my-4 text-center">Service Request Summary</h2>

        <h5> Your Total Service Requests on <span class="text-primary">HouseKart</span> till date: {{ total }}</h5>


        
        <div v-if="total > 0" class="status-container">
          <div class="status-item">
            <h5 class="status-label">🛠️ Requested Services %: </h5>
            <div class="progress-bar">
              <div class="progress requested" :style="{ width: requestedPercent + '%' }"></div>
            </div>
            <h1 class="percentage">({{ requestedPercent.toFixed(2) }}%)</h1>
          </div>
          
          <div class="status-item">
            <h5 class="status-label">❗Pending Services %: </h5>
            <div class="progress-bar">
              <div class="progress pending" :style="{ width: pendingPercent + '%' }"></div>
            </div>
            <h1 class="percentage">({{ pendingPercent.toFixed(2) }}%)</h1>
          </div>
          
          <div class="status-item">
            <h5 class="status-label">✅ Completed Services %: </h5>
            <div class="progress-bar">
              <div class="progress completed" :style="{ width: completedPercent + '%' }"></div>
            </div>
            <h1 class="percentage">({{ completedPercent.toFixed(2) }}%)</h1>
          </div>
        </div>
        
        <div v-else>
          <p class="text-center">No service requests available.</p>
        </div>
      </div>
      </div>
    `,
  
    data() {
      return {
        count: {
          requested: 0,
          pending: 0,
          completed: 0
        }
      };
    },
  
    computed: {
      total() {
        return this.count.requested + this.count.pending + this.count.completed;
      },
      requestedPercent() {
        return this.total ? (this.count.requested / this.total) * 100 : 0;
      },
      pendingPercent() {
        return this.total ? (this.count.pending / this.total) * 100 : 0;
      },
      completedPercent() {
        return this.total ? (this.count.completed / this.total) * 100 : 0;
      }
    },
  
    created() {
      this.fetchData();
    },
  
    methods: {
      async fetchData() {
        try {
          const response = await fetch(`/service_requests_customer_count`, {
            method: 'GET',
            headers: {
              "Authentication-Token": localStorage.getItem('auth-token'),
              'Content-Type': 'application/json',
            }
          });
  
          if (!response.ok) throw new Error("Failed to fetch data");
          const data = await response.json();
  
          this.count.requested = data.Requested 
          this.count.pending = data.Pending
          this.count.completed = data.Completed 
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
  };
  