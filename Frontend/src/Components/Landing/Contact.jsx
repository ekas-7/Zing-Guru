import { Mail, Phone, MapPin, Github } from 'lucide-react'

const CONTACT_INFO = {
  email: {
    icon: Mail,
    title: "Email",
    value: "sujal21102004@gmail.com",
  },
  phone: {
    icon: Phone,
    title: "Phone",
    value: "+91 91156 64773",
  },
  location: {
    icon: MapPin,
    title: "Location",
    value: "NIT Jalandhar",
  },
  github: {
    icon: Github,
    title: "GitHub",
    value: "https://github.com/ekas-7/Zing-Guru/",
    link: "https://github.com/ekas-7/Zing-Guru/"
  }
};

const FORM_FIELDS = {
  firstName: {
    id: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "John",
  },
  lastName: {
    id: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Doe",
  },
  email: {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "john.doe@example.com",
  },
  message: {
    id: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Write your message here...",
    rows: 4,
  },
};

export default function Contact() {
  return (
    <div id='contact' className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-16 dark:text-white">
        Get in <span className="bg-[#ADFF00] px-2 font-['Dancing_Script']">Touch</span>
      </h2>
      
      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {['firstName', 'lastName'].map((field) => (
                <div key={field}>
                  <label 
                    htmlFor={FORM_FIELDS[field].id} 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {FORM_FIELDS[field].label}
                  </label>
                  <input
                    type={FORM_FIELDS[field].type}
                    id={FORM_FIELDS[field].id}
                    placeholder={FORM_FIELDS[field].placeholder}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ADFF00] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
            
            <div>
              <label 
                htmlFor={FORM_FIELDS.email.id} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {FORM_FIELDS.email.label}
              </label>
              <input
                type={FORM_FIELDS.email.type}
                id={FORM_FIELDS.email.id}
                placeholder={FORM_FIELDS.email.placeholder}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ADFF00] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label 
                htmlFor={FORM_FIELDS.message.id} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {FORM_FIELDS.message.label}
              </label>
              <textarea
                id={FORM_FIELDS.message.id}
                rows={FORM_FIELDS.message.rows}
                placeholder={FORM_FIELDS.message.placeholder}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg h-50 resize-none focus:ring-2 focus:ring-[#ADFF00] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {Object.entries(CONTACT_INFO).map(([key, info]) => (
            <div key={key} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="bg-[#ADFF00] p-4 rounded-lg">
                  <info.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">{info.value}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
