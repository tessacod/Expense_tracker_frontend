export const environment = {
    production: true,
    name: 'prod',
    apiUrl: 'https://expense-tracker-backend-5wm8.onrender.com',
    endpoints: {
      expense: {
        add: '/expense/add',
        update: '/expense/update',
        delete: '/expense/delete',
        list: '/expense/list'
      },
      budget: {
        add: '/budget/add',
        update: '/budget/update',
        delete: '/budget/delete',
        list: '/budget/list'
      },    
      income: {
        add: '/income/add',
        update: '/income/update',
        delete: '/income/delete',
        list: '/income/list'
      }
    
    }
  };