import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwapRequestCard } from '@/components/swaps/SwapRequestCard';
import { motion } from 'framer-motion';
import { Info, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function SwapsPage() {
  const { user, isAuthenticated } = useAuth();
  const { userRequests } = useSkillSwap();
  
  // Filter swap requests by status
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const activeRequests = userRequests.filter(req => req.status === 'accepted');
  const completedRequests = userRequests.filter(req => req.status === 'completed');
  const rejectedRequests = userRequests.filter(req => req.status === 'rejected');
  
  // States for received and sent requests
  const [showSent, setShowSent] = useState(false);
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // Filter requests by whether the user sent or received them
  const sentRequests = userRequests.filter(req => req.requesterId === user.id);
  const receivedRequests = userRequests.filter(req => req.providerId === user.id);
  
  const getFilteredRequests = (requests) => {
    return showSent ? requests.filter(req => req.requesterId === user.id) : 
                     requests.filter(req => req.providerId === user.id);
  };

  // Calculate stats for overview
  const totalSwaps = userRequests.length;
  const successRate = totalSwaps > 0 
    ? Math.round((completedRequests.length / totalSwaps) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-5xl py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">My Skill Swaps</h1>
          <p className="mt-2 text-gray-600">Manage your skill exchange requests and track your progress</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={showSent ? "outline" : "default"} 
            size="lg" 
            onClick={() => setShowSent(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            Received ({receivedRequests.length})
          </Button>
          <Button 
            variant={showSent ? "default" : "outline"} 
            size="lg" 
            onClick={() => setShowSent(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            Sent ({sentRequests.length})
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10 p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Swaps</p>
            <p className="text-2xl font-bold text-gray-800">{totalSwaps}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-800">{pendingRequests.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-800">{completedRequests.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-gray-800">{successRate}%</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm mb-6">
          <TabsTrigger 
            value="pending" 
            className="py-3 text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Pending ({getFilteredRequests(pendingRequests).length})
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="py-3 text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Active ({getFilteredRequests(activeRequests).length})
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="py-3 text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Completed ({getFilteredRequests(completedRequests).length})
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            className="py-3 text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Rejected ({getFilteredRequests(rejectedRequests).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="py-6">
          {getFilteredRequests(pendingRequests).length > 0 ? (
            <div className="grid gap-6">
              {getFilteredRequests(pendingRequests).map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SwapRequestCard swapRequest={request} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-lg text-gray-500">No pending requests {showSent ? "sent" : "received"}</p>
              <p className="text-sm text-gray-400 mt-2">Check back later or create a new swap request!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="py-6">
          {getFilteredRequests(activeRequests).length > 0 ? (
            <div className="grid gap-6">
              {getFilteredRequests(activeRequests).map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SwapRequestCard swapRequest={request} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-lg text-gray-500">No active swaps at the moment</p>
              <p className="text-sm text-gray-400 mt-2">Start a new skill swap to get going!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="py-6">
          {getFilteredRequests(completedRequests).length > 0 ? (
            <div className="grid gap-6">
              {getFilteredRequests(completedRequests).map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SwapRequestCard swapRequest={request} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-lg text-gray-500">No completed swaps yet</p>
              <p className="text-sm text-gray-400 mt-2">Complete a swap to see it here!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="py-6">
          {getFilteredRequests(rejectedRequests).length > 0 ? (
            <div className="grid gap-6">
              {getFilteredRequests(rejectedRequests).map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SwapRequestCard swapRequest={request} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-lg text-gray-500">No rejected requests</p>
              <p className="text-sm text-gray-400 mt-2">You're doing great!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <div className="mt-8 flex items-center gap-2 text-gray-500 text-sm">
        <Info className="h-5 w-5" />
        <p>Tip: Click on a swap request to view details or take action</p>
      </div>
    </motion.div>
  );
}