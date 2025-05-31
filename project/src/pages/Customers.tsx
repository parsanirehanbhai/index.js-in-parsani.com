import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign, 
  X, 
  Save,
  Loader
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  joinDate: string;
  payment: {
    status: 'paid' | 'pending';
    amount: number;
    due: number;
    history: {
      date: string;
      amount: number;
      type: 'payment' | 'due';
    }[];
  };
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    type: 'payment',
  });
  
  useEffect(() => {
    // In a real app, this would fetch data from the backend
    // For demo purposes, we'll use mock data
    const fetchCustomers = () => {
      setTimeout(() => {
        const mockCustomers: Customer[] = [
          {
            id: 1,
            name: 'Amit Shah',
            phone: '+91 9876543210',
            email: 'amit@example.com',
            joinDate: '2023-01-15',
            payment: {
              status: 'pending', 
              amount: 1500, 
              due: 500,
              history: [
                { date: '2023-05-01', amount: 1000, type: 'payment' },
                { date: '2023-04-01', amount: 1500, type: 'due' },
              ]
            }
          },
          {
            id: 2,
            name: 'Rahul Patel',
            phone: '+91 9876543211',
            email: 'rahul@example.com',
            joinDate: '2023-02-10',
            payment: {
              status: 'paid', 
              amount: 1500, 
              due: 0,
              history: [
                { date: '2023-05-01', amount: 1500, type: 'payment' },
                { date: '2023-04-01', amount: 1500, type: 'due' },
              ]
            }
          },
          {
            id: 3,
            name: 'Priya Desai',
            phone: '+91 9876543212',
            email: 'priya@example.com',
            joinDate: '2023-01-05',
            payment: {
              status: 'pending', 
              amount: 1500, 
              due: 1000,
              history: [
                { date: '2023-05-01', amount: 500, type: 'payment' },
                { date: '2023-04-01', amount: 1500, type: 'due' },
              ]
            }
          },
          {
            id: 4,
            name: 'Suresh Kumar',
            phone: '+91 9876543213',
            email: 'suresh@example.com',
            joinDate: '2023-03-20',
            payment: {
              status: 'paid', 
              amount: 1500, 
              due: 0,
              history: [
                { date: '2023-05-01', amount: 1500, type: 'payment' },
                { date: '2023-04-01', amount: 1500, type: 'due' },
              ]
            }
          },
          {
            id: 5,
            name: 'Neha Singh',
            phone: '+91 9876543214',
            email: 'neha@example.com',
            joinDate: '2023-02-25',
            payment: {
              status: 'pending', 
              amount: 1500, 
              due: 750,
              history: [
                { date: '2023-05-01', amount: 750, type: 'payment' },
                { date: '2023-04-01', amount: 1500, type: 'due' },
              ]
            }
          }
        ];
        
        setCustomers(mockCustomers);
        setLoading(false);
      }, 1000);
    };
    
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const newId = customers.length + 1;
      const newCustomerObj: Customer = {
        id: newId,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        joinDate: new Date().toISOString().split('T')[0],
        payment: {
          status: 'pending',
          amount: 1500,
          due: 1500,
          history: [
            { date: new Date().toISOString().split('T')[0], amount: 1500, type: 'due' }
          ]
        }
      };
      
      setCustomers([...customers, newCustomerObj]);
      setNewCustomer({ name: '', phone: '', email: '' });
      setShowAddModal(false);
      setLoading(false);
    }, 1000);
  };

  const handleAddPayment = () => {
    if (!selectedCustomer) return;
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const updatedCustomers = customers.map(customer => {
        if (customer.id === selectedCustomer.id) {
          const newDue = Math.max(0, customer.payment.due - newPayment.amount);
          const newHistory = [
            { 
              date: new Date().toISOString().split('T')[0], 
              amount: newPayment.amount, 
              type: 'payment' as const 
            },
            ...customer.payment.history
          ];
          
          return {
            ...customer,
            payment: {
              ...customer.payment,
              due: newDue,
              status: newDue === 0 ? 'paid' as const : 'pending' as const,
              history: newHistory
            }
          };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
      setNewPayment({ amount: 0, type: 'payment' });
      setShowPaymentModal(false);
      setSelectedCustomer(null);
      setLoading(false);
    }, 1000);
  };

  const deleteCustomer = (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setLoading(true);
      setTimeout(() => {
        setCustomers(customers.filter(customer => customer.id !== id));
        setLoading(false);
      }, 500);
    }
  };

  const openPaymentModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewPayment({ amount: customer.payment.due, type: 'payment' });
    setShowPaymentModal(true);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && customers.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-800 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Customers</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {customer.payment.status === 'paid' ? 'Paid' : `₹${customer.payment.due} due`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => openPaymentModal(customer)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          disabled={customer.payment.status === 'paid'}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Payment
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Customer
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCustomer}
                >
                  {loading ? <Loader className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                  Save Customer
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add Payment for {selectedCustomer.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Current due: ₹{selectedCustomer.payment.due}
                      </p>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                          Payment Amount (₹)
                        </label>
                        <input
                          type="number"
                          id="amount"
                          min="0"
                          max={selectedCustomer.payment.due}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Payment History</h4>
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedCustomer.payment.history.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                                    {item.date}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                                    ₹{item.amount}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      item.type === 'payment' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {item.type === 'payment' ? 'Payment' : 'Due'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddPayment}
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Record Payment
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;