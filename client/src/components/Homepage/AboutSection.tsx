import React from 'react';
import { Shield, Award, Globe, Heart, Quote } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr. Wanjiku Mwangi',
    role: 'CEO & Co-founder',
    quote: 'I started this to give Kenyan pharmacists the tools they deserve.',
    funFact: 'Formerly ran a community pharmacy in Nakuru.',
    initials: 'WM',
    color: 'from-teal-100 to-teal-50',
  },
  {
    name: 'Odhiambo Omondi',
    role: 'CTO',
    quote: 'Secure code, happy pharmacies.',
    funFact: 'Built his first POS at 16.',
    initials: 'OO',
    color: 'from-amber-100 to-amber-50',
  },
  {
    name: 'Akinyi Otieno',
    role: 'Head of Product',
    quote: 'I design for the person behind the counter.',
    funFact: 'Collects vintage pharmacy ads.',
    initials: 'AO',
    color: 'from-emerald-100 to-emerald-50',
  },
  {
    name: 'Dr. Kamau Njoroge',
    role: 'Clinical Advisor',
    quote: 'Compliance should feel like a safety net, not a cage.',
    funFact: 'Also lectures at University of Nairobi.',
    initials: 'KN',
    color: 'from-rose-100 to-rose-50',
  },
];

const certifications = [
  { name: 'Pharmacy & Poisons Board (Kenya)', icon: Shield },
  { name: 'HIPAA Compliant', icon: Award },
  { name: 'GDPR Ready', icon: Globe },
  { name: 'ISO 27001 Certified', icon: Shield },
];

export default function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative overflow-hidden">
      {/* Decorative background elements – organic feel */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      {/* Mission – asymmetrical layout */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Built in Kenya,<br />for every pharmacy.
          </h2>
          <div className="w-20 h-1 bg-teal-500 rounded-full"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-lg text-gray-700 italic relative">
            <Quote className="absolute -top-3 -left-3 w-8 h-8 text-teal-200 rotate-180" />
            We believe that great pharmacy software starts with understanding the daily reality of 
            Kenyan pharmacists – from managing queues in bustling towns to tracking expiries in remote clinics.
            <span className="block mt-3 font-medium text-teal-700">— Wanjiku & Odhiambo</span>
          </p>
        </div>
      </div>

      {/* Team introduction – handcrafted card grid */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-teal-600 rounded-full"></span>
          The people behind the pixels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group relative bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient background that appears on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${member.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{member.name}</h4>
                    <p className="text-xs text-teal-700 font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic mb-2">"{member.quote}"</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-teal-400 rounded-full"></span>
                  {member.funFact}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          * We’re a fully remote team spread across Nairobi, Kisumu, and Mombasa.
        </p>
      </div>

      {/* Compliance & Certifications – with a local twist */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-teal-600 rounded-full"></span>
          Trusted & certified
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certifications.map((cert) => {
            const Icon = cert.icon;
            return (
              <div
                key={cert.name}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-teal-300 transition-colors"
              >
                <Icon className="w-8 h-8 text-teal-600 mb-2" />
                <span className="text-sm font-medium text-gray-800">{cert.name}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 text-center mt-6 bg-gray-50 p-3 rounded-lg">
          🇰🇪 Fully compliant with Kenyan data protection laws (Data Protection Act, 2019) and international standards.
        </p>
      </div>
    </section>
  );
}