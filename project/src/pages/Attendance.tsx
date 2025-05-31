import { useState, useEffect } from 'react';
import { Calendar, Check, X, Send, Download, Loader } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface Customer {
  id: number;
  name: string;
  phone: string;
  attendance: {
    status: 'present' | 'absent' | null;
    date: string;
  };
  payment: {
    status: 'paid' | 'pending';
    amount: number;
    due: number;
  };
}

const Attendance = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [date, setDate] = useState<string>(formatDate(new Date()));
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState<number | null>(null);
  const [messagePreview, setMessagePreview] = useState<{ visible: boolean; customer: Customer | null }>({
    visible: false,
    customer: null
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
            attendance: { status: 'present', date: formatDate(new Date()) },
            payment: { status: 'pending', amount: 1500, due: 500 }
          },
          {
            id: 2,
            name: 'Rahul Patel',
            phone: '+91 9876543211',
            attendance: { status: 'absent', date: formatDate(new Date()) },
            payment: { status: 'paid', amount: 1500, due: 0 }
          },
          {
            id: 3,
            name: 'Priya Desai',
            phone: '+91 9876543212',
            attendance: { status: null, date: formatDate(new Date()) },
            payment: { status: 'pending', amount: 1500, due: 1000 }
          },
          {
            id: 4,
            name: 'Suresh Kumar',
            phone: '+91 9876543213',
            attendance: { status: 'present', date: formatDate(new Date()) },
            payment: { status: 'paid', amount: 1500, due: 0 }
          },
          {
            id: 5,
            name: 'Neha Singh',
            phone: '+91 9876543214',
            attendance: { status: null, date: formatDate(new Date()) },
            payment: { status: 'pending', amount: 1500, due: 750 }
          }
        ];
        
        setCustomers(mockCustomers);
        setLoading(false);
      }, 1000);
    };
    
    fetchCustomers();
  }, []);

  const markAttendance = (customerId: number, status: 'present' | 'absent') => {
    setSavingAttendance(customerId);
    
    // Simulate API call
    setTimeout(() => {
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, attendance: { status, date: date } } 
            : customer
        )
      );
      setSavingAttendance(null);
    }, 500);
  };

  const showMessagePreview = (customer: Customer) => {
    setMessagePreview({ visible: true, customer });
  };

  const closeMessagePreview = () => {
    setMessagePreview({ visible: false, customer: null });
  };

  const generateMessageText = (customer: Customer) => {
    const attendanceStatus = customer.attendance.status === 'present' ? 'PRESENT' : 'ABSENT';
    const paymentStatus = customer.payment.status === 'paid' 
      ? 'Your payment is up to date.' 
      : `Outstanding payment: ₹${customer.payment.due}.`;
    
    return `Dear ${customer.name},\n\nAttendance for ${date}: ${attendanceStatus}\n${paymentStatus}\n\nThank you,\nDilsha Danta`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Calendar className="h-5 w-5 text-blue-800" />
            <h2 className="text-lg font-semibold text-gray-800">Attendance for {date}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              onClick={() => setDate(formatDate(new Date()))}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Mark Attendance</h3>
          <p className="text-sm text-gray-600 mt-1">Click on the buttons to mark attendance for each customer</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.phone}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => markAttendance(customer.id, 'present')}
                        disabled={savingAttendance === customer.id}
                        className={`p-2 rounded-md ${
                          customer.attendance.status === 'present'
                            ? 'bg-green-100 text-green-800 ring-2 ring-green-600'
                            : 'bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-800'
                        }`}
                      >
                        {savingAttendance === customer.id ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => markAttendance(customer.id, 'absent')}
                        disabled={savingAttendance === customer.id}
                        className={`p-2 rounded-md ${
                          customer.attendance.status === 'absent'
                            ? 'bg-red-100 text-red-800 ring-2 ring-red-600'
                            : 'bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-800'
                        }`}
                      >
                        {savingAttendance === customer.id ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <X className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => showMessagePreview(customer)}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900"
                      disabled={!customer.attendance.status}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out">
            <Download className="h-4 w-4 mr-2" />
            Export Attendance
          </button>
        </div>
      </div>

      {/* Message Preview Modal */}
      {messagePreview.visible && messagePreview.customer && (
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
                      Message Preview
                    </h3>
                    <div className="mt-4">
                      <textarea
                        className="w-full h-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={generateMessageText(messagePreview.customer)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Message
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeMessagePreview}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;