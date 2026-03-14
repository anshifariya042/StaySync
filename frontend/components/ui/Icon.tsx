import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className = "" }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default Icon;
