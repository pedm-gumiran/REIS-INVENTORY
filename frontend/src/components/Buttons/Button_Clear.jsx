import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Button from './Button';

export default function Button_Clear({
  onClick,
  label = "Clear Form",
  ...props
}) {
  return (
    <Button
      label={label}
      icon={<FiTrash2 />}
      variant="secondary"
      size="lg"
      className="border-2 border-blue-500 hover:border-blue-600 text-slate-600 bg-white hover:bg-slate-100 rounded-xl"
      onClick={onClick}
      {...props}
    />
  );
}
