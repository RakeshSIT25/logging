import React from 'react';

const Dashboard = ({ children }) => {
    return (
        <div className="flex flex-col gap-6">
            {children}
        </div>
    );
};

export default Dashboard;
