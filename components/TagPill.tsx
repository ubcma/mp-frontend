import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TagPillProps {
  icon: LucideIcon;
  text: string;
  textColor: string;
  bgColor: string;
}

const TagPill: React.FC<TagPillProps> = ({ icon: Icon, text, textColor, bgColor }) => {
  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Icon className="h-4 w-4" style={{ color: textColor }} />
      <span>{text}</span>
    </div>
  );
};

export default TagPill;