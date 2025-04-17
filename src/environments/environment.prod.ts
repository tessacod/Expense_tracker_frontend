export const environment = {
    production: true,
    name: 'prod',
    apiUrl: 'http://localhost:3001',
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