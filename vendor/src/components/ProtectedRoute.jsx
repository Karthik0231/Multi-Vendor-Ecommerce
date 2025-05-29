import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorContext } from '../Context/Context';
import { config } from '../Config/Config';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { vendor, setVendor } = useContext(VendorContext);
  const { host } = config;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('vendorToken');
    
    if (!vendor && token) {
      // Verify token and get vendor data
      const verifyToken = async () => {
        try {
          const response = await axios.get(`${host}/vendor/verify`, {
            headers: {
              'auth-token': token
            }
          });
          
          if (response.data.success) {
            setVendor(response.data.vendor);
          } else {
            localStorage.removeItem('vendorToken');
            navigate('/login');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('vendorToken');
          navigate('/login');
        }
      };
      verifyToken();
    } else if (!vendor && !token) {
      // Redirect to login if no vendor and no token
      navigate('/login');
    }
  }, [vendor, navigate, setVendor, host]);

  // Show loading while verifying token
  if (!vendor) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;