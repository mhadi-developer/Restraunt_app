"use client";
import { useEffect, useState } from "react";
import "@/assets/CSS/user-orders.css";
import axiosInstance from "@/libs/axiosInstance";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import SpinnerCircle from "@/components/Spinner";
import { redirect } from "next/navigation";

// --- TypeScript Interfaces ---
export interface OrderItem {
  id: number;
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  orderId: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: string;
  orderType: string;
  orderStatus: string;
  kitchenNote: string | null;
  deliveryFee: number;
  discountAmount: number;
  discountRate: number;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: User;
}

// --- Mock Data (Based on your API response) ---

export const UserOrdersPage: React.FC = () => {
    const {loginUser} = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading , setLoading] = useState<boolean>(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ordersPerPage = 5;


    useEffect(()=>{
        const getUserOrders = async () => {
            setLoading(true)
         try{
             const response = await axiosInstance.get("/get/user/orders");
             if(response.status === 200 || response.status === 304){
                toast.success("orders fetch successfully");
                setOrders(response?.data?.orders);
                setLoading(false)
             }
  
         }catch(e){
             toast.error("Failed to fetch orders");
             console.log(e);
         }finally{
            setLoading(false)
         }
        }

        if (loginUser?.email)
        { 
            getUserOrders();

        }
        
    } , [loginUser?.email])
  // Utility to format the date into a readable string
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Utility to handle navigation - adapt this for Next.js (useRouter) or React Router (useNavigate)
  const handleViewDetails = (orderId: number) => {
  redirect(`/order/${orderId}`)
  };

    if(loading) return <span><p>loading orders.................please wait</p> <SpinnerCircle size={128}/> </span>

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="orders-page-container">
      <div className="orders-content">
        <h1 className="orders-title">My Orders</h1>
        
        <div className="orders-list">
          {currentOrders.map((order) => (
            <div key={order.id} className="order-card">
              
              {/* Top Row: Order ID & Status */}
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`order-status ${order.orderStatus.toLowerCase()}`}>
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>

              {/* Middle Row: Minimal Details */}
              <div className="order-body">
                <div className="order-detail-group">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{order.orderType}</span>
                </div>
                <div className="order-detail-group">
                  <span className="detail-label">Items:</span>
                  <span className="detail-value">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} item(s)
                  </span>
                </div>
                <div className="order-detail-group">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value highlight-total">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="order-footer">
                <button 
                  className="btn-view-details"
                  onClick={() => handleViewDetails(order.id)}
                >
                  View Details
                </button>
              </div>
              
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                borderRadius: '0.25rem',
                border: '1px solid #e2e8f0',
                backgroundColor: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                color: currentPage === 1 ? '#94a3b8' : '#0f172a',
                transition: 'all 0.2s'
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: '500' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                borderRadius: '0.25rem',
                border: '1px solid #e2e8f0',
                backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
                transition: 'all 0.2s'
              }}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserOrdersPage;