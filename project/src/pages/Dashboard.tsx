import { useState, useEffect } from 'react';
import { 
  UserCheck, 
  UserX, 
  DollarSign, 
  AlertCircle, 
  Clock,
  Users
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const Dashboard = () => {
  const [stats, setStats] = useState({
    presentToday: 0,
    absentToday: 0,
    pendingPayments: 0,
    totalCustomers: 0
  });
  
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from the backend
    // For demo purposes, we'll use mock data
    const fetchData = () => {
      setTimeout(() => {
        setStats({
          presentToday: 12,
          absentToday: 5,
          pendingPayments: 8,
          totalCustomers: 17
        });
        
        setRecentAttendance([
          { id: 1, name: 'Amit Shah', date: new Date(), status: 'present', payment: { due: 500, status: 'pending' } },
          { id: 2, name: 'Rahul Patel', date: new Date(), status: 'absent', payment: { due: 0, status: 'paid' } },
          { id: 3, name: 'Priya Desai', date: new Date(), status: 'present', payment: { due: 1000, status: 'pending' } },
          { id: 4, name: 'Suresh Kumar', date: new Date(), status: 'present', payment: { due: 0, status: 'paid' } },
          { id: 5, name: 'Neha Singh', date: new Date(), status: 'absent', payment: { due: 750, status: 'pending' } }
        ]);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Present Today</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.presentToday}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            {((stats.presentToday / (stats.presentToday + stats.absentToday)) * 100).toFixed(1)}% attendance rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Absent Today</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.absentToday}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-red-600">
            {((stats.absentToday / (stats.presentToday + stats.absentToday)) * 100).toFixed(1)}% absence rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingPayments}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600">
            {((stats.pendingPayments / stats.totalCustomers) * 100).toFixed(1)}% of customers
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalCustomers}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-600">
            View all customers
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Today's Attendance</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatDate(new Date())}</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.payment.status === 'pending' ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-900">₹{item.payment.due} due</span>
                        </>
                      ) : (
                        <span className="text-sm text-green-600">Paid</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Message
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;