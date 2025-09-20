import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageCircle, Building, HelpCircle, User, ArrowRight, CheckCircle, Briefcase, Users
} from "lucide-react";

import HeaderBanner from "../../components/landing/HeaderBanner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  inquiryType: string;
  employeeId: string;
  message: string;
}

interface ContactMethod {
  icon: JSX.Element;
  title: string;
  description: string;
  info: string[];
  action: string;
  availability: string;
}

interface OfficeLocation {
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  services: string[];
}

export default function EcommerceContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    department: '',
    inquiryType: '',
    employeeId: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        inquiryType: '',
        employeeId: '',
        message: ''
      });
    }, 3000);
  };

  const contactMethods: ContactMethod[] = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Support Helpline",
      description: "Speak directly with our support specialists",
      info: ["+250 788 123 456", "+250 788 654 321"],
      action: "Call Support",
      availability: "24/7 Emergency Support"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Send us your queries anytime",
      info: ["support@ecommerce.rw", "help@ecommerce.rw"],
      action: "Send Email",
      availability: "Response within 4 hours"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Get instant help from our team",
      info: ["Available on portal", "WhatsApp: +250 788 123 456"],
      action: "Start Chat",
      availability: "8 AM - 6 PM"
    }
  ];

  const officeLocations: OfficeLocation[] = [
    {
      name: "Main Office",
      address: "KG 15 Ave, Kimihurura",
      city: "Kigali, Rwanda",
      phone: "+250 788 123 456",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM",
      services: ["Customer Support", "Order Processing", "Returns Management"]
    },
    {
      name: "Operations Center",
      address: "KN 3 Rd, Nyarutarama",
      city: "Kigali, Rwanda",
      phone: "+250 788 654 321",
      hours: "Mon - Fri: 9:00 AM - 5:00 PM",
      services: ["Logistics Support", "Vendor Management", "Technical Support"]
    }
  ];

  const inquiryTypes = [
    "Order Inquiry",
    "Product Question",
    "Return Request",
    "Payment Issue",
    "Account Support",
    "Technical Issue",
    "Complaint",
    "System Access Issue",
    "Document Request",
    "General Support",
    "Other"
  ];

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-100">
      <HeaderBanner
        title="Contact Us"
        subtitle="Home / Contact Us"
        backgroundStyle="image"
        icon={<Users className="w-10 h-10" />}
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-15"></div>
      </div>
      <section className="py-20">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Preferred Way</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple ways to reach our support team - pick what works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="group bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-100 hover:border-primary-300 hover:-translate-y-2">
                <div className="text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{method.title}</h4>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <div className="space-y-2 mb-6">
                  {method.info.map((info, idx) => (
                    <p key={idx} className="text-gray-700 font-medium">{info}</p>
                  ))}
                </div>
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                    <Clock className="w-4 h-4 mr-2" />
                    {method.availability}
                  </span>
                </div>
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 group-hover:bg-primary-700">
                  <span>{method.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
              <p className="text-gray-600 mb-8">Fill out the form and we'll get back to you within 4 hours</p>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                  <p className="text-gray-600">Thank you for contacting us. We'll respond soon.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>    
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                     <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="your@email.rw"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Tell us about your inquiry or concern..."
                    ></textarea>
                  </div>

                  <div
                    onClick={handleSubmit}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 text-lg shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8 w-full">
              <div className=" w-full h-full" >
                <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15950.091986388362!2d30.058139241667106!3d-1.9440999999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca425ae39d801%3A0x5e373f7aaeb3d63a!2sKimihurura%2C%20Kigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1697046781234!5m2!1sen!2us"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}