import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-background">
            <div className="w-12 h-12 border-4 border-neutral-300 border-t-ma-red rounded-full animate-spin"/>
        </div>
    );
};

export default Loading;
