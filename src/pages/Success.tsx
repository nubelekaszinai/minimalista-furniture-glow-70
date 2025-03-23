
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Show toast notification when the page loads
    toast({
      title: "Payment successful",
      description: "Thank you for your purchase!",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-furniture-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-furniture-lightgray text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-display font-medium text-furniture-charcoal mb-4">Payment Successful</h1>
        
        <p className="mb-6 text-furniture-darkgray">
          Thank you for your purchase! Your order has been successfully processed.
        </p>
        
        <p className="mb-8 text-furniture-gray text-sm">
          A confirmation email with details of your purchase has been sent to your email address.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm bg-furniture-charcoal px-6 py-3 text-sm font-medium text-furniture-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring uppercase tracking-wider"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Success;
