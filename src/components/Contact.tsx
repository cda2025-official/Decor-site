import { Mail, Phone, Globe, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:contact@example.com",
  },
  {
    icon: Globe,
    label: "Links",
    href: "#",
  },
  {
    icon: Phone,
    label: "Save Contact",
    href: "#",
  },
  {
    icon: MessageSquare,
    label: "WhatsApp",
    href: "#",
  },
];

const Contact = () => {
  return (
    <div className="bg-midnight py-12 max-w-[935px] w-full sm:w-screen mx-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center"
              >
                <a
                  href={item.href}
                  className="group flex items-center text-gray-400 hover:text-gold transition-colors duration-300"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold/20 rounded-full filter blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Icon className="w-5 h-5 mr-2 relative z-10" />
                  </div>
                  <span className="font-space">{item.label}</span>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Contact;