
import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const HospitableFooter = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        'Channel Manager',
        'Automated Messaging',
        'Dynamic Pricing',
        'Guest Screening',
        'Revenue Analytics',
        'Mobile App',
      ],
    },
    {
      title: 'Resources',
      links: [
        'Help Center',
        'Blog',
        'Webinars',
        'Case Studies',
        'API Documentation',
        'Status Page',
      ],
    },
    {
      title: 'Company',
      links: [
        'About Us',
        'Careers',
        'Press',
        'Partners',
        'Contact',
        'Security',
      ],
    },
    {
      title: 'Legal',
      links: [
        'Privacy Policy',
        'Terms of Service',
        'Cookie Policy',
        'GDPR',
        'Compliance',
        'Data Processing',
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-blue-400 mb-4">hospitable</div>
            <p className="text-gray-400 mb-6">
              The all-in-one platform for short-term rental automation and growth.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Hospitable. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 lg:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
