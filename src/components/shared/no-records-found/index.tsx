import React from 'react';

const NoRecordsFound = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-center py-60">
      <div className="text-[1.3rem] text-slate-400">{text}</div>
    </div>
  );
};

export default NoRecordsFound;
