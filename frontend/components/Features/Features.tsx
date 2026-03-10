import React from 'react';

const features = [
    {
        id: 1,
        title: 'Multi-hostel Discovery',
        text: 'Browse thousands of verified hostels across major cities. Compare prices, facilities, and reviews instantly.',
        icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />,
        color: '#e0e7ff',
        iconColor: '#4f46e5'
    },
    {
        id: 2,
        title: 'Easy Complaint Submission',
        text: 'Report maintenance or living issues directly through the app. No more waiting in lines or chasing managers.',
        icon: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" />,
        color: '#d1fae5',
        iconColor: '#059669'
    },
    {
        id: 3,
        title: 'Faster Issue Resolution',
        text: 'Real-time status tracking for all your requests. Get notifications as soon as your problem is being fixed.',
        icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />,
        color: '#fef3c7',
        iconColor: '#d97706'
    },
    {
        id: 4,
        title: 'Direct Communication',
        text: 'Integrated chat with hostel administration and roommates. Keep all your important conversations in one place.',
        icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
        color: '#ede9fe',
        iconColor: '#7c3aed'
    },
    {
        id: 5,
        title: 'Digital Management System',
        text: 'For hostel owners, manage occupants, payments, and staff through a comprehensive dashboard.',
        icon: <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />,
        color: '#ccfbf1',
        iconColor: '#0d9488'
    }
];

export default function Features() {
    return (
        <section className="container mx-auto px-6 py-24 text-center" id="how-it-works">
            <h2 className="text-[2.25rem] font-extrabold text-foreground mb-4">Everything you need for a better stay</h2>
            <p className="text-text-gray text-[1.1rem] max-w-[600px] mx-auto mb-16 leading-relaxed">
                Managing hostel life has never been this simple. Our digital ecosystem handles the stress, you enjoy the experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {features.map((feature) => (
                    <div key={feature.id} className="bg-white border border-border-color rounded-2xl p-10 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: feature.color, color: feature.iconColor }}>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {feature.icon}
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                        <p className="text-text-gray leading-[1.6] text-[0.95rem]">{feature.text}</p>
                    </div>
                ))}

                <div className="bg-primary-blue text-white rounded-2xl p-10 flex flex-col justify-center items-center text-center">
                    <h3 className="text-[1.75rem] font-bold mb-6">Ready to Sync?</h3>
                    <button className="bg-white text-primary-blue font-bold px-7 py-3 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity">Get Started Now</button>
                </div>
            </div>
        </section>
    );
}
