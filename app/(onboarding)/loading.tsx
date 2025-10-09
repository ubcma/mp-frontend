import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-pink-400 via-red-400 to-pink-500">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"/>
        </div>
    );
};

export default Loading; 