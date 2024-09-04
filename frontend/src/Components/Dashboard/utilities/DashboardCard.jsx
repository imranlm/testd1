import React from 'react';
function DashboardCard({ label, value }) {
    return (
        <div className="p-4 rounded-lg shadow-md hover:shadow-blue-200 shadow-gray-200 cursor-pointer" style={{ background: '#deebff' }}>
            <p className="text-3xl text-black font-medium mb-2">{value}</p>
            <p className="text-gray-500">{label}</p>
        </div>
    );
}

export default DashboardCard;
