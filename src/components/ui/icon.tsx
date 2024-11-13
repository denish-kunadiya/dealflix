import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const iconVariants = cva('', {
  variants: {
    variant: {
      default: 'text-inherit',
      primary: 'text-sky-500',
      disabled: 'text-slate-400',
      destructive: 'text-red-500',
      light: 'text-slate-50',
      dark: 'text-slate-700',
    },
    size: {
      default: 'h-6 min-h-6 w-6 min-w-6',
      sm: 'h-[18px] min-h-[18px] w-[18px] min-w-[18px]',
      xs: 'h-3 min-h-3 w-3 min-w-3',
    },
    icon: {
      briefcase: '',
      camera: '',
      'double-check': '',
      folders: '',
      home: '',
      information: '',
      paste: '',
      tree: '',
      plus: '',
      pencil: '',
      trash: '',
      user: '',
      call: '',
      calendar: '',
      flag: '',
      filter: '',
      search: '',
      'chevron-image': '',
      'chevron-info': '',
      x: '',
      subtraction: '',
      'chevron-down': '',
      spin: '',
      bell: '',
      setting: '',
      stack: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface SvgProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof iconVariants> {}

const IconBriefcase = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <rect
          width="24"
          height="24"
          fill="transparent"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7H20C21.1046 7 22 7.89543 22 9V10L12.2425 12.9086C12.0833 12.9484 11.9167 12.9484 11.7575 12.9086L2 10V9C2 7.89543 2.89543 7 4 7H7V5ZM15 5H9V7H15V5Z"
          fill="currentColor"
        />
        <path
          d="M22 12L12.7276 14.8489C12.2499 14.9683 11.7501 14.9683 11.2724 14.8489L2 12V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V12Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconBriefcase.displayName = 'IconBriefcase';

const IconCamera = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.17 5L7.74407 3.6167C7.89901 3.24335 8.26348 3 8.66769 3H15.3323C15.7365 3 16.101 3.24335 16.2559 3.6167L16.83 5H20C21.1 5 22 5.9 22 7V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V7C2 5.9 2.9 5 4 5H7.17ZM18 13C18 16.3137 15.3137 19 12 19C8.68629 19 6 16.3137 6 13C6 9.68629 8.68629 7 12 7C15.3137 7 18 9.68629 18 13Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconCamera.displayName = 'IconCamera';

const IconDoubleCheck = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M8.03728 11.0929L6.65685 12.4733L12.3137 18.6285L22.9203 7.52359L21.5061 6.10938L12.3137 15.7985L8.03728 11.0929Z"
          fill="currentColor"
        />
        <path
          d="M1 12.4733L2.41421 11.0591L2.45569 11.1006L8.06722 17.1519L6.65685 18.6285L1 12.4733Z"
          fill="currentColor"
        />
        <path
          d="M12.215 12.8092L17.2635 7.52359L15.8492 6.10938L10.7403 11.2183L12.215 12.8092Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconDoubleCheck.displayName = 'IconDoubleCheck';

const IconFolders = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M4 9C2.89543 9 2 9.89543 2 11V19C2 20.1046 2.89543 21 4 21H16C17.1046 21 18 20.1046 18 19H6C4.89543 19 4 18.1046 4 17V9Z"
          fill="currentColor"
        />
        <path
          d="M8 3C6.89543 3 6 3.89543 6 5V15C6 16.1046 6.89543 17 8 17H20C21.1046 17 22 16.1046 22 15V7C22 5.89543 21.1046 5 20 5H14C14 3.89543 13.1046 3 12 3H8Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconFolders.displayName = 'IconFolders';

const IconHome = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M12 3C11.8678 3.00002 11.7368 3.02626 11.6148 3.07722C11.4928 3.12818 11.382 3.20284 11.2891 3.29688L1.20312 12.0977C1.14013 12.1441 1.08894 12.2048 1.05366 12.2746C1.01838 12.3445 0.999997 12.4217 1 12.5C1 12.6326 1.05268 12.7598 1.14645 12.8536C1.24021 12.9473 1.36739 13 1.5 13H4V21C4 21.552 4.448 22 5 22H9C9.552 22 10 21.552 10 21V15H14V21C14 21.552 14.448 22 15 22H19C19.552 22 20 21.552 20 21V13H22.5C22.6326 13 22.7598 12.9473 22.8536 12.8536C22.9473 12.7598 23 12.6326 23 12.5C23 12.4217 22.9816 12.3445 22.9463 12.2746C22.9111 12.2048 22.8599 12.1441 22.7969 12.0977L12.7168 3.30273C12.7149 3.30077 12.7129 3.29882 12.7109 3.29688C12.618 3.20284 12.5072 3.12818 12.3852 3.07722C12.2632 3.02626 12.1322 3.00002 12 3Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconHome.displayName = 'IconHome';

const IconInformation = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M16 19.7166L15.7392 20.9251C14.9568 21.2752 14.3318 21.5417 13.8665 21.7248C13.4006 21.9086 12.8593 22 12.2425 22C11.2953 22 10.5586 21.737 10.0332 21.2145C9.50773 20.69 9.24492 20.0253 9.24492 19.219C9.24492 18.9069 9.26399 18.5858 9.30364 18.2587C9.34362 17.9312 9.40719 17.5623 9.49418 17.1501L10.4719 13.2269C10.5589 12.8512 10.6329 12.4953 10.6921 12.1587C10.7521 11.8242 10.7811 11.5164 10.7811 11.2393C10.7811 10.7383 10.6896 10.3879 10.5074 10.1909C10.3252 9.99439 9.97763 9.89464 9.46156 9.89464C9.20879 9.89464 8.949 9.94054 8.68419 10.0293C8.41821 10.1184 8.19087 10.2045 8 10.2845L8.26146 9.07504C8.90199 8.7794 9.51425 8.52624 10.0999 8.31612C10.6856 8.10544 11.2389 8 11.7624 8C12.703 8 13.4289 8.25771 13.9386 8.77314C14.4483 9.28895 14.7031 9.9576 14.7031 10.7816C14.7031 10.952 14.6863 11.2524 14.6504 11.6818C14.6152 12.112 14.5498 12.5063 14.4545 12.8649L13.4809 16.7723C13.4011 17.0862 13.3293 17.445 13.2669 17.8487C13.2025 18.2498 13.1717 18.5562 13.1717 18.7618C13.1717 19.2806 13.2738 19.6349 13.4784 19.8232C13.6845 20.0115 14.0394 20.1052 14.5436 20.1052C14.7803 20.1052 15.0497 20.0576 15.3489 19.9641C15.6474 19.8706 15.865 19.7885 16 19.7166Z"
          fill="currentColor"
        />
        <path
          d="M16 4C16 5.10457 15.1046 6 14 6C12.8954 6 12 5.10457 12 4C12 2.89543 12.8954 2 14 2C15.1046 2 16 2.89543 16 4Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconInformation.displayName = 'IconInformation';

const IconPaste = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M10 3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3H15C15.5523 3 16 3.44772 16 4V6H8V4C8 3.44772 8.44772 3 9 3H10Z"
          fill="currentColor"
        />
        <path
          d="M5 4H6V6V21H18V6V4H19C19.5523 4 20 4.44772 20 5V22C20 22.5523 19.5523 23 19 23H5C4.44772 23 4 22.5523 4 22V5C4 4.44771 4.44772 4 5 4Z"
          fill="currentColor"
        />
        <path
          d="M8 6V4H6V6H8Z"
          fill="currentColor"
        />
        <path
          d="M16 4V6H18V4H16Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 6H8H6V21H18V6H16ZM16 12V10H8V12H16ZM8 14H14V16H8V14Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconPaste.displayName = 'IconPaste';

const IconTree = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M9.53052 18.75V22.0019H5.27734C4.72461 22.0019 4.27734 22.4496 4.27734 23.0019C4.27734 23.5541 4.72461 24.0019 5.27734 24.0019H17.8555C18.4082 24.0019 18.8555 23.5541 18.8555 23.0019C18.8555 22.4496 18.4082 22.0019 17.8555 22.0019H13.6006V18.75H9.53052Z"
          fill="currentColor"
        />
        <path
          d="M3 11.96C3 14.6 5.14014 16.75 7.78003 16.75H15.3501C17.99 16.75 20.1301 14.6 20.1301 11.96C20.1301 10.41 19.3801 8.97998 18.1602 8.09003C18.3201 7.65002 18.4001 7.19 18.4001 6.71002C18.4001 4.85999 17.1699 3.27002 15.46 2.76001C14.8901 1.13 13.3501 0 11.5701 0C9.84009 0 8.33008 1.04999 7.72998 2.62C6.01001 3.29999 4.86011 4.96002 4.86011 6.84003C4.86011 7.25 4.91992 7.65997 5.02002 8.04999C3.77002 8.94 3 10.39 3 11.96Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconTree.displayName = 'IconTree';

const IconPlus = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M13 2H11V11H2V13H11V22H13V13H22V11H13V2Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconPlus.displayName = 'IconPlus';

const IconPencil = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M3 17.2486V20.9986H6.75L17.81 9.93859L14.06 6.18859L3 17.2486ZM20.71 7.03859C21.1 6.64859 21.1 6.01859 20.71 5.62859L18.37 3.28859C17.98 2.89859 17.35 2.89859 16.96 3.28859L15.13 5.11859L18.88 8.86859L20.71 7.03859Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconPencil.displayName = 'IconPencil';

const IconTrash = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5 19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H21V4H15V3C15 2.44772 14.5523 2 14 2H10C9.44772 2 9 2.44772 9 3V4H3V6H5V19ZM11 8V17H9V8H11ZM15 17V8H13V17H15Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
IconTrash.displayName = 'IconTrash';

const UserIcon = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M12 11.3333C14.3669 11.3333 16.2857 8.87581 16.2857 6.66667C16.2857 4.45753 15.5714 2 12 2C8.42857 2 7.71429 4.45753 7.71429 6.66667C7.71429 8.87581 9.63307 11.3333 12 11.3333Z"
          fill="currentColor"
        />
        <path
          d="M12 14C4.22222 14 2 15.3333 2 22L22 22C22 15.3333 19.7778 14 12 14Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
UserIcon.displayName = 'UserIcon';

const Call = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path
          d="M13.3444 17.9778C10.2 16.3667 7.62222 13.8 6.02222 10.6556L8.77371 8.6036C9.09322 8.36532 9.24072 7.96006 9.14912 7.57216L8.0152 2.77018C7.90862 2.31884 7.50572 2 7.04197 2H3.11111C2.5 2 2 2.5 2 3.11111C2 13.5444 10.4556 22 20.8889 22C21.5 22 22 21.5 22 20.8889V16.9567C22 16.4935 21.682 16.091 21.2315 15.9838L16.4299 14.8414C16.041 14.7489 15.6343 14.8969 15.3958 15.2177L13.3444 17.9778Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Call.displayName = 'Call';

const Calendar = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.71429 2C6.92531 2 6.28571 2.63959 6.28571 3.42857V4.85714H3.42857C2.63959 4.85714 2 5.49674 2 6.28571V20.5714C2 21.3604 2.63959 22 3.42857 22H20.5714C21.3604 22 22 21.3604 22 20.5714V6.28571C22 5.49674 21.3604 4.85714 20.5714 4.85714H17.7143V3.42857C17.7143 2.63959 17.0747 2 16.2857 2C15.4967 2 14.8571 2.63959 14.8571 3.42857V4.85714H9.14286V3.42857C9.14286 2.63959 8.50326 2 7.71429 2ZM4.85714 10.5714H19.1429V19.1429H4.85714V10.5714Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Calendar.displayName = 'Calendar';

const Flag = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 2H3V22H6.4V15.3333H20L17.1667 8.66667L20 2Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Flag.displayName = 'Flag';

const Filter = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 2H2V4.2396C2 4.72943 2.17976 5.20223 2.50518 5.56833L9.49482 13.4317C9.82024 13.7978 10 14.2706 10 14.7604V23L14 21V14.7604C14 14.2706 14.1798 13.7978 14.5052 13.4317L21.4948 5.56833C21.8202 5.20223 22 4.72943 22 4.2396V2Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Filter.displayName = 'Filter';

const Search = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0491 13.4633C10.7873 14.4274 9.21054 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 9.21053 14.4274 10.7873 13.4633 12.0491L20.0055 18.5913L18.5913 20.0055L12.0491 13.4633ZM13 7.5C13 10.5376 10.5376 13 7.5 13C4.46243 13 2 10.5376 2 7.5C2 4.46243 4.46243 2 7.5 2C10.5376 2 13 4.46243 13 7.5Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Search.displayName = 'Search';

const ChevronInfo = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10.0828 10H10.7495H12.0828C12.451 10 12.7495 10.2985 12.7495 10.6667V15.3333H13.4162H14.0828V16.6667H13.4162H12.0828H10.7495H10.0828V15.3333H10.7495H11.4162V11.3333H10.7495H10.0828V10ZM12.0827 9C12.635 9 13.0827 8.55228 13.0827 8C13.0827 7.44771 12.635 7 12.0827 7C11.5304 7 11.0827 7.44771 11.0827 8C11.0827 8.55228 11.5304 9 12.0827 9Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
ChevronInfo.displayName = 'ChevronInfo';

const X = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 13.4152L19.7782 21.1934L21.1924 19.7792L13.4142 12.001L21.1924 4.22281L19.7782 2.80859L12 10.5868L4.22183 2.80859L2.80762 4.22281L10.5858 12.001L2.80762 19.7792L4.22183 21.1934L12 13.4152Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
X.displayName = 'X';

const Subtraction = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 0H0V2H5L7 2H12V0H7H5Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Subtraction.displayName = 'Subtraction';

const ChevronDown = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.3787 12L6.43934 19.5613C5.85355 20.1192 5.85355 21.0237 6.43934 21.5816C7.02513 22.1395 7.97487 22.1395 8.56066 21.5816L17.5607 13.0102C18.1464 12.4523 18.1464 11.5477 17.5607 10.9898L8.56066 2.41842C7.97488 1.86053 7.02513 1.86053 6.43934 2.41842C5.85356 2.97631 5.85356 3.88083 6.43934 4.43872L14.3787 12Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
ChevronDown.displayName = 'ChevronDown';

const ChevronImage = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 19.7778V4.22222C22 3 21 2 19.7778 2H4.22222C3 2 2 3 2 4.22222V19.7778C2 21 3 22 4.22222 22H19.7778C21 22 22 21 22 19.7778ZM8.11111 13.6667L10.8889 17.0111L14.7778 12L19.7778 18.6667H4.22222L8.11111 13.6667Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
ChevronImage.displayName = 'ChevronImage';

const Spin = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    );
  },
);
Spin.displayName = 'Spin';

const Bell = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.959 22.0625C14.059 22.0625 14.959 21.1394 14.959 20.0112H10.959C10.959 21.1394 11.849 22.0625 12.959 22.0625ZM18.959 15.9087V10.7804C18.959 7.63173 17.319 4.99583 14.459 4.2984V3.60096C14.459 2.74968 13.789 2.0625 12.959 2.0625C12.129 2.0625 11.459 2.74968 11.459 3.60096V4.2984C8.58898 4.99583 6.95898 7.62147 6.95898 10.7804V15.9087H6.49745C5.64778 15.9087 4.95898 16.5974 4.95898 17.4471C4.95898 18.2968 5.64778 18.9856 6.49745 18.9856H19.4205C20.2702 18.9856 20.959 18.2968 20.959 17.4471C20.959 16.5974 20.2702 15.9087 19.4205 15.9087H18.959Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Bell.displayName = 'Bell';

const Setting = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.4308 13.0425C19.4708 12.7225 19.5008 12.4025 19.5008 12.0625C19.5008 11.7225 19.4708 11.4025 19.4308 11.0825L21.5408 9.4325C21.7308 9.2825 21.7808 9.0125 21.6608 8.7925L19.6608 5.3325C19.5408 5.1125 19.2708 5.0325 19.0508 5.1125L16.5608 6.1125C16.0408 5.7125 15.4808 5.3825 14.8708 5.1325L14.4908 2.4825C14.4608 2.2425 14.2508 2.0625 14.0008 2.0625H10.0008C9.75082 2.0625 9.54082 2.2425 9.51082 2.4825L9.13082 5.1325C8.52082 5.3825 7.96082 5.7225 7.44082 6.1125L4.95082 5.1125C4.72082 5.0225 4.46082 5.1125 4.34082 5.3325L2.34082 8.7925C2.21082 9.0125 2.27082 9.2825 2.46082 9.4325L4.57082 11.0825C4.53082 11.4025 4.50082 11.7325 4.50082 12.0625C4.50082 12.3925 4.53082 12.7225 4.57082 13.0425L2.46082 14.6925C2.27082 14.8425 2.22082 15.1125 2.34082 15.3325L4.34082 18.7925C4.46082 19.0125 4.73082 19.0925 4.95082 19.0125L7.44082 18.0125C7.96082 18.4125 8.52082 18.7425 9.13082 18.9925L9.51082 21.6425C9.54082 21.8825 9.75082 22.0625 10.0008 22.0625H14.0008C14.2508 22.0625 14.4608 21.8825 14.4908 21.6425L14.8708 18.9925C15.4808 18.7425 16.0408 18.4025 16.5608 18.0125L19.0508 19.0125C19.2808 19.1025 19.5408 19.0125 19.6608 18.7925L21.6608 15.3325C21.7808 15.1125 21.7308 14.8425 21.5408 14.6925L19.4308 13.0425ZM12.0008 15.5625C10.0708 15.5625 8.50082 13.9925 8.50082 12.0625C8.50082 10.1325 10.0708 8.5625 12.0008 8.5625C13.9308 8.5625 15.5008 10.1325 15.5008 12.0625C15.5008 13.9925 13.9308 15.5625 12.0008 15.5625Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
Setting.displayName = 'Setting';

const ChevronNavigation = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.42351 0.0943224C5.1551 -0.0314437 4.8447 -0.0314407 4.57628 0.0943307L0.230041 2.13087C-0.0766024 2.27456 -0.0765988 2.71076 0.230048 2.85444L4.66116 4.93064C4.87589 5.03125 5.1242 5.03125 5.33893 4.93064L9.77001 2.85445C10.0767 2.71077 10.0767 2.27456 9.77001 2.13088L5.42351 0.0943224Z"
          fill="currentColor"
        />
        <path
          d="M1.0567 4.24047L0.229981 4.62785C-0.0766631 4.77153 -0.0766595 5.20774 0.229987 5.35142L4.6611 7.42761C4.87582 7.52822 5.12414 7.52822 5.33887 7.42761L9.76995 5.35143C10.0766 5.20775 10.0766 4.77153 9.76995 4.62785L8.94328 4.24051L5.33893 5.92933C5.1242 6.02994 4.87589 6.02994 4.66116 5.92933L1.0567 4.24047Z"
          fill="currentColor"
        />
        <path
          d="M1.0567 6.7374L0.229981 7.12478C-0.0766631 7.26846 -0.0766594 7.70467 0.229987 7.84835L4.6611 9.92454C4.87582 10.0252 5.12414 10.0252 5.33887 9.92454L9.76995 7.84836C10.0766 7.70468 10.0766 7.26847 9.76995 7.12478L8.94328 6.73745L5.33893 8.42627C5.1242 8.52688 4.87589 8.52688 4.66116 8.42627L1.0567 6.7374Z"
          fill="currentColor"
        />
      </svg>
    );
  },
);
ChevronNavigation.displayName = 'ChevronNavigation';

const Icon = React.forwardRef<SVGSVGElement, SvgProps>(
  ({ className, icon, variant, size, ...props }, ref) => {
    let IconComponent = null;

    switch (icon) {
      case 'briefcase':
        IconComponent = IconBriefcase;
        break;

      case 'camera':
        IconComponent = IconCamera;
        break;

      case 'double-check':
        IconComponent = IconDoubleCheck;
        break;

      case 'folders':
        IconComponent = IconFolders;
        break;

      case 'home':
        IconComponent = IconHome;
        break;

      case 'information':
        IconComponent = IconInformation;
        break;

      case 'paste':
        IconComponent = IconPaste;
        break;

      case 'tree':
        IconComponent = IconTree;
        break;

      case 'plus':
        IconComponent = IconPlus;
        break;

      case 'pencil':
        IconComponent = IconPencil;
        break;

      case 'trash':
        IconComponent = IconTrash;
        break;

      case 'user':
        IconComponent = UserIcon;
        break;

      case 'call':
        IconComponent = Call;
        break;

      case 'calendar':
        IconComponent = Calendar;
        break;

      case 'flag':
        IconComponent = Flag;
        break;

      case 'filter':
        IconComponent = Filter;
        break;

      case 'search':
        IconComponent = Search;
        break;

      case 'chevron-image':
        IconComponent = ChevronImage;
        break;

      case 'chevron-info':
        IconComponent = ChevronInfo;
        break;

      case 'x':
        IconComponent = X;
        break;

      case 'subtraction':
        IconComponent = Subtraction;
        break;

      case 'chevron-down':
        IconComponent = ChevronDown;
        break;

      case 'bell':
        IconComponent = Bell;
        break;

      case 'setting':
        IconComponent = Setting;
        break;

      case 'spin':
        IconComponent = Spin;
        break;

      case 'stack':
        IconComponent = ChevronNavigation;
        break;
    }

    return (
      IconComponent && (
        <IconComponent
          className={cn(iconVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    );
  },
);
Icon.displayName = 'Icon';

export { Icon, iconVariants };
