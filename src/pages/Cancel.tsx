
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

const Cancel = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Show toast notification when the page loads
    toast({
      title: "Payment cancelled",
      description: "Your payment was cancelled. No charges were made.",
      variant: "destructive",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-furniture-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-furniture-lightgray text-center">
        <div className="mb-6 flex justify-center">
          <AlertTriangle size={64} className="text-amber-500" />
        </div>
        
        <h1 className="text-3xl font-display font-medium text-furniture-charcoal mb-4">Payment Cancelled</h1>
        
        <p className="mb-6 text-furniture-darkgray">
          Your payment has been cancelled. No charges were made to your account.
        </p>
        
        <p className="mb-8 text-furniture-gray text-sm">
          If you encountered any issues or have questions about our products, please feel free to contact us.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm bg-furniture-charcoal px-6 py-3 text-sm font-medium text-furniture-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring uppercase tracking-wider w-full"
          >
            Return to Home
          </Link>
          
          <Link 
            to="/#products" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm bg-furniture-lightgray px-6 py-3 text-sm font-medium text-furniture-charcoal transition-colors hover:bg-furniture-mediumgray focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring uppercase tracking-wider w-full"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
