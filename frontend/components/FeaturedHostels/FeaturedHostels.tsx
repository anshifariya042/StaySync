import React from 'react';

const hostels = [
    {
        id: 1,
        name: 'Skyline Residencia',
        price: '$450',
        location: 'Midtown, Manhattan',
        rating: '4.8',
        image: '/hostel_1.png',
    },
    {
        id: 2,
        name: 'The Green Dorms',
        price: '$380',
        location: 'Shoreditch, London',
        rating: '4.9',
        image: '/hostel_1.png',
    },
    {
        id: 3,
        name: 'Urban Living Hub',
        price: '$520',
        location: 'Mitte, Berlin',
        rating: '4.7',
        image: '/hostel_1.png',
    }
];

export default function FeaturedHostels() {
    return (
        <section className="container mx-auto px-6 py-24" id="hostels">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h2 className="text-[2rem] font-extrabold text-foreground mb-2">Featured Hostels</h2>
                    <p className="text-text-gray text-base">Handpicked stays with verified reviews and premium facilities.</p>
                </div>
                <a href="#" className="text-primary-blue font-bold flex items-center gap-2 hover:underline">View All &rarr;</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {hostels.map((hostel) => (
                    <div key={hostel.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:translate-y-[-5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all border border-border-color p-4">
                        <div className="relative w-full h-[220px] rounded-xl overflow-hidden mb-5">
                            <img src={hostel.image} alt={hostel.name} className="w-full h-full object-cover" style={{ filter: hostel.id > 1 ? `hue-rotate(${hostel.id * 40}deg)` : 'none' }} />
                            <div className="absolute top-4 right-4 bg-white px-2.5 py-1 rounded-full text-[0.85rem] font-bold flex items-center gap-1 text-foreground shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                                <svg className="text-[#f59e0b]" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                {hostel.rating}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-foreground">{hostel.name}</h3>
                                <div className="text-xl font-extrabold text-primary-blue-light">{hostel.price}<span className="text-[0.85rem] font-medium text-text-gray">/mo</span></div>
                            </div>

                            <div className="flex items-center gap-1.5 text-text-gray text-[0.9rem] mb-4">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                {hostel.location}
                            </div>

                            <div className="flex gap-3 mb-6 text-[#9ca3af]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                            </div>

                            <button className="w-full py-3 bg-transparent border border-border-color rounded-lg font-semibold text-[0.95rem] text-foreground hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all cursor-pointer">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
