
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Delete, X } from 'lucide-react';

interface AtmKeypadProps {
  onInput: (val: string) => void;
  onDelete: () => void;
  onClear: () => void;
  className?: string;
}

export function AtmKeypad({ onInput, onDelete, onClear, className }: AtmKeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {keys.slice(0, 9).map((key) => (
        <Button
          key={key}
          variant="secondary"
          className="h-14 text-xl font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
          onClick={() => onInput(key)}
          type="button"
        >
          {key}
        </Button>
      ))}
      <Button
        variant="destructive"
        className="h-14 text-lg font-bold rounded-xl active:scale-95"
        onClick={onClear}
        type="button"
      >
        <X className="w-5 h-5" />
      </Button>
      <Button
        variant="secondary"
        className="h-14 text-xl font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
        onClick={() => onInput('0')}
        type="button"
      >
        0
      </Button>
      <Button
        variant="secondary"
        className="h-14 text-lg font-bold rounded-xl active:scale-95"
        onClick={onDelete}
        type="button"
      >
        <Delete className="w-5 h-5" />
      </Button>
    </div>
  );
}
