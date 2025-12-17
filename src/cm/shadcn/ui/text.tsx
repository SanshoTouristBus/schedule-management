import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@shadcn/lib/utils';
import {textColorStr, textTypeStr} from '@shadcn/lib/variant-types';

export const textVariantObject: {
  type: Record<textTypeStr, string>;
  color: Record<textColorStr, string>;
  underline: Record<string, string>;
  link: Record<string, string>;
} = {
  type: {
    heading: 'font-bold text-[24px]',
    label: ' font-semibold text-[20px]',
    body: 'font-normal text-[16px]',
    small: 'font-normal text-[12px] leading-5',
  },

  color: {
    black: 'text-black  lack',
    gray: 'text-gray-500  border-gray-600 ',
    primary: 'text-primary  border-primary',
    secondary: 'text-secondary  border-secondary',
    info: 'text-info  border-info',
    success: 'text-success  border-success',
    warning: 'text-warning  border-warning',
    destructive: 'text-destructive  border-destructive',
    disabled: 'text-disabled  border-disabled',
  },
  underline: {
    true: 'underline underline-offset-2 ',
    false: '',
  },
  link: {
    true: 'text-blue-500 font-bold cursor-pointer underline ',
    false: '',
  },
};

const textVariants = cva('', {
  variants: textVariantObject,
  defaultVariants: {type: 'body', color: 'black'},
});

function Text({
  className,
  color,
  type,
  underline,
  link,
  asChild = false,
  ...props
}: React.ComponentProps<'p'> &
  Omit<VariantProps<typeof textVariants>, 'underline' | 'link'> & {
    asChild?: boolean;
    underline?: boolean;
    link?: boolean;
  }) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="text"
      className={cn(
        textVariants({
          color,
          type,
          className,
          underline: underline ? 'true' : 'false',
          link: link ? 'true' : 'false',
        })
      )}
      {...props}
    />
  );
}

export {Text, textVariants};
