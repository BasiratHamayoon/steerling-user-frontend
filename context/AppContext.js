'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '@/services/authService';
import categoryService from '@/services/categoryService';
import productService from '@/services/productService';
import messageService from '@/services/messageService';
import dashboardService from '@/services/dashboardService';

const AppContext = createContext();

export function AppProvider({ children }) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesPagination, setCategoriesPagination] = useState(null);

  
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPagination, setProductsPagination] = useState(null);

const [messages, setMessages] = useState([]);
const [messagesLoading, setMessagesLoading] = useState(false);
const [messagesPagination, setMessagesPagination] = useState(null);
const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  
  useEffect(() => {
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }

    
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const savedAdmin = localStorage.getItem('admin');

        if (accessToken && savedAdmin) {
          setAdmin(JSON.parse(savedAdmin));
          setIsAuthenticated(true);

          
          try {
            const response = await authService.getProfile();
            setAdmin(response.data);
          } catch (error) {
            
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('admin');
            setAdmin(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      } else {
        
        return [...prevCart, { ...product, cartQuantity: quantity }];
      }
    });
    showNotification(`${product.title} added to cart!`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    showNotification('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, cartQuantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Cart cleared', 'info');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.cartQuantity, 0);
  };

  
  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      setError(null);

      const response = await authService.login(email, password);

      if (response.success) {
        const { admin: adminData, accessToken, refreshToken } = response.data;

        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('admin', JSON.stringify(adminData));

        setAdmin(adminData);
        setIsAuthenticated(true);
        setIsAdminLoginOpen(false); 

        showNotification('Login successful!', 'success');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('admin');
      setAdmin(null);
      setIsAuthenticated(false);
      showNotification('Logged out successfully', 'success');
    }
  };

  const register = async (name, email, password) => {
    try {
      setAuthLoading(true);
      setError(null);

      const response = await authService.register({ name, email, password });

      if (response.success) {
        const { admin: adminData, accessToken, refreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('admin', JSON.stringify(adminData));

        setAdmin(adminData);
        setIsAuthenticated(true);
        setIsAdminLoginOpen(false);

        showNotification('Registration successful!', 'success');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  
const fetchCategories = useCallback(async (params = {}) => {
  console.log('=== fetchCategories called ==='); 
  console.log('Params:', params);
  
  try {
    setCategoriesLoading(true);
    setError(null);

    console.log('Calling categoryService.getAll...'); 
    const response = await categoryService.getAll(params);
    console.log('categoryService response:', response); 

    if (response.success) {
      console.log('Setting categories:', response.data.categories); 
      setCategories(response.data.categories);
      setCategoriesPagination(response.data.pagination);
    }

    return response;
  } catch (error) {
    console.error('fetchCategories ERROR:', error); 
    const message = error.response?.data?.message || error.message || 'Failed to fetch categories';
    setError(message);
    return { success: false, error: message };
  } finally {
    setCategoriesLoading(false);
  }
}, []);

  const fetchCategoryById = async (id) => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.getById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Category not found';
      setError(message);
      return { success: false, error: message };
    } finally {
      setCategoriesLoading(false);
    }
  };

  const createCategory = async (data) => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.create(data);

      if (response.success) {
        setCategories((prev) => [response.data, ...prev]);
        showNotification('Category created successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create category';
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setCategoriesLoading(false);
    }
  };

  const updateCategory = async (id, data) => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.update(id, data);

      if (response.success) {
        setCategories((prev) =>
          prev.map((cat) => (cat._id === id ? response.data : cat))
        );
        showNotification('Category updated successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update category';
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setCategoriesLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.delete(id);

      if (response.success) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        showNotification('Category deleted successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete category';
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setCategoriesLoading(false);
    }
  };

  
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setProductsLoading(true);
      setError(null);

      const response = await productService.getAll(params);

      if (response.success) {
        setProducts(response.data.products);
        setProductsPagination(response.data.pagination);
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      setError(message);
      return { success: false, error: message };
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchProductById = async (id) => {
    try {
      setProductsLoading(true);
      const response = await productService.getById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Product not found';
      setError(message);
      return { success: false, error: message };
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId, params = {}) => {
    try {
      setProductsLoading(true);
      const response = await productService.getByCategory(categoryId, params);

      if (response.success) {
        setProducts(response.data.products);
        setProductsPagination(response.data.pagination);
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      setError(message);
      return { success: false, error: message };
    } finally {
      setProductsLoading(false);
    }
  };

  const searchProducts = useCallback(async (query) => {
    if (!query.trim()) {
      return { success: true, data: { products: [] } };
    }

    try {
      setProductsLoading(true);
      const response = await productService.getAll({ search: query, limit: 10 });
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const createProduct = async (formData) => {
    try {
      setProductsLoading(true);
      const response = await productService.create(formData);

      if (response.success) {
        setProducts((prev) => [response.data, ...prev]);
        showNotification('Product created successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setProductsLoading(false);
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      setProductsLoading(true);
      const response = await productService.update(id, formData);

      if (response.success) {
        setProducts((prev) =>
          prev.map((prod) => (prod._id === id ? response.data : prod))
        );
        showNotification('Product updated successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setProductsLoading(false);
    }
  };

  const updateProductStock = async (id, quantity) => {
    try {
      const response = await productService.updateStock(id, quantity);

      if (response.success) {
        setProducts((prev) =>
          prev.map((prod) =>
            prod._id === id
              ? {
                  ...prod,
                  quantity: response.data.product.quantity,
                  stockStatus: response.data.product.stockStatus,
                }
              : prod
          )
        );
        showNotification('Stock updated successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update stock';
      showNotification(message, 'error');
      return { success: false, error: message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      setProductsLoading(true);
      const response = await productService.delete(id);

      if (response.success) {
        setProducts((prev) => prev.filter((prod) => prod._id !== id));
        showNotification('Product deleted successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      showNotification(message, 'error');
      return { success: false, error: message };
    } finally {
      setProductsLoading(false);
    }
  };

  const deleteProductImage = async (id, imageUrl) => {
    try {
      const response = await productService.deleteImage(id, imageUrl);

      if (response.success) {
        setProducts((prev) =>
          prev.map((prod) =>
            prod._id === id ? { ...prod, images: response.data.images } : prod
          )
        );
        showNotification('Image deleted successfully!', 'success');
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete image';
      showNotification(message, 'error');
      return { success: false, error: message };
    }
  };

  const fetchProductStats = async () => {
    try {
      const response = await productService.getStats();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      return { success: false, error: message };
    }
  };

  const sendMessage = async (data) => {
  try {
    const response = await messageService.sendMessage(data);
    if (response.success) {
      showNotification('Message sent successfully!', 'success');
    }
    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send message';
    showNotification(message, 'error');
    return { success: false, error: message };
  }
};

const fetchMessages = useCallback(async (params = {}) => {
  try {
    setMessagesLoading(true);
    const response = await messageService.getAll(params);
    
    if (response.success) {
      setMessages(response.data.messages);
      setMessagesPagination(response.data.pagination);
      setUnreadMessagesCount(response.data.unreadCount);
    }
    
    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch messages';
    setError(message);
    return { success: false, error: message };
  } finally {
    setMessagesLoading(false);
  }
}, []);

const fetchMessageById = async (id) => {
  try {
    setMessagesLoading(true);
    const response = await messageService.getById(id);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Message not found';
    setError(message);
    return { success: false, error: message };
  } finally {
    setMessagesLoading(false);
  }
};

const replyToMessage = async (id, replyData) => {
  try {
    const response = await messageService.reply(id, replyData);
    
    if (response.success) {
      setMessages(prev => prev.map(msg => 
        msg._id === id ? response.data : msg
      ));
      showNotification(response.message, 'success');
    }
    
    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send reply';
    showNotification(message, 'error');
    return { success: false, error: message };
  }
};

const updateMessageStatus = async (id, status) => {
  try {
    const response = await messageService.updateStatus(id, status);
    
    if (response.success) {
      setMessages(prev => prev.map(msg => 
        msg._id === id ? response.data : msg
      ));
    }
    
    return response;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const archiveMessage = async (id) => {
  try {
    const response = await messageService.toggleArchive(id);
    
    if (response.success) {
      setMessages(prev => prev.filter(msg => msg._id !== id));
      showNotification(response.message, 'success');
    }
    
    return response;
  } catch (error) {
    showNotification('Failed to archive message', 'error');
    return { success: false, error: error.message };
  }
};

const deleteMessage = async (id) => {
  try {
    const response = await messageService.delete(id);
    
    if (response.success) {
      setMessages(prev => prev.filter(msg => msg._id !== id));
      showNotification('Message deleted successfully', 'success');
    }
    
    return response;
  } catch (error) {
    showNotification('Failed to delete message', 'error');
    return { success: false, error: error.message };
  }
};

const bulkUpdateMessages = async (ids, action) => {
  try {
    const response = await messageService.bulkUpdate(ids, action);
    
    if (response.success) {
      await fetchMessages();
      showNotification(response.message, 'success');
    }
    
    return response;
  } catch (error) {
    showNotification('Bulk action failed', 'error');
    return { success: false, error: error.message };
  }
};

const fetchMessageStats = async () => {
  try {
    const response = await messageService.getStats();
    return response;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  const changePassword = async (currentPassword, newPassword) => {
  try {
    setAuthLoading(true);
    setError(null);

    const response = await authService.changePassword(currentPassword, newPassword);

    if (response.success) {
      const { accessToken, refreshToken } = response.data;

      // Update tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      showNotification('Password changed successfully! Please log in again.', 'success');
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to change password';
    setError(message);
    showNotification(message, 'error');
    return { success: false, error: message };
  } finally {
    setAuthLoading(false);
  }
};

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardService.getStats();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard stats';
      console.error('fetchDashboardStats error:', error); // Debug
      return { success: false, error: message };
    }
  };

  const fetchRecentMessages = async (limit = 5) => {
    try {
      const response = await dashboardService.getRecentMessages(limit);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch recent messages';
      return { success: false, error: message };
    }
  };
  const clearError = () => setError(null);
  const clearNotification = () => setNotification(null);

  
  const value = {
    
    searchQuery,
    setSearchQuery,
    cart,
    isSearchOpen,
    setIsSearchOpen,
    isAdminLoginOpen,
    setIsAdminLoginOpen,

    fetchDashboardStats,
    fetchRecentMessages,

    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,

    
    admin,
    isAuthenticated,
    authLoading,
    login,
    logout,
    register,
    changePassword,

    
    categories,
    categoriesLoading,
    categoriesPagination,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,

    
    products,
    productsLoading,
    productsPagination,
    fetchProducts,
    fetchProductById,
    fetchProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
    deleteProductImage,
    fetchProductStats,

    
    error,
    notification,
    showNotification,
    clearError,
    clearNotification,

     messages,
  messagesLoading,
  messagesPagination,
  unreadMessagesCount,
  sendMessage,
  fetchMessages,
  fetchMessageById,
  replyToMessage,
  updateMessageStatus,
  archiveMessage,
  deleteMessage,
  bulkUpdateMessages,
  fetchMessageStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export default AppContext;