import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {children}
    </div>
  );
};