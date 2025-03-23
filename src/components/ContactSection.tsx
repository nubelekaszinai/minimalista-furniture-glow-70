
import { useState } from "react";
import { useToast } from "../hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
        duration: 5000,
      });
      
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="page-section bg-furniture-white">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-sm tracking-widest uppercase text-furniture-gray mb-3">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-furniture-charcoal mb-4">Contact Us</h2>
          <p className="text-furniture-gray">
            Have a question about our products or interested in a custom piece? Send us a message and we'll get back to you.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm text-furniture-darkgray mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-furniture-lightgray focus:border-furniture-charcoal focus:outline-none transition-colors duration-300"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-furniture-darkgray mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-furniture-lightgray focus:border-furniture-charcoal focus:outline-none transition-colors duration-300"
                placeholder="Your email address"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm text-furniture-darkgray mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-furniture-lightgray focus:border-furniture-charcoal focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Your message"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="buy-button w-full disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-furniture-charcoal mb-2">Email</h3>
              <p className="text-furniture-gray">info@minimalista.com</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-furniture-charcoal mb-2">Phone</h3>
              <p className="text-furniture-gray">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-furniture-charcoal mb-2">Showroom</h3>
              <p className="text-furniture-gray">123 Design Street, New York</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
