import Spinner from '@/components/common/Spinner';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Loading;
