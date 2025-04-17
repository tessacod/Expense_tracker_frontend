export const environment = {
    production: false,
    name: 'qa',
    apiUrl: 'http://localhost:3001',
    endpoints: {
      // Same structure as dev.ts
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
