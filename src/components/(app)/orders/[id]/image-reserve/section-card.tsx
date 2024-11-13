'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import React from 'react';
import PathHeading from './path-heading';

const SectionCard = ({ path, imageUploadData }: { path: string; imageUploadData: any }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-[104px] w-full items-center justify-between border-b">
      <PathHeading
        title={imageUploadData.title}
        imageUploadUrl={imageUploadData.url}
        noOfImageUpload={imageUploadData.noOfImageUpload}
      />
      <Button
        variant={'outline'}
        className="w-[166px] border"
        size={'sm'}
        onClick={() => {
          router.push(`${pathname}/${path}`);
        }}
      >
        <Icon
          size={'sm'}
          icon="plus"
          className="h-4 w-4 text-sky-500"
        />
        <span className="ms-2 font-bold text-sky-500"> Add photo </span>
      </Button>
    </div>
  );
};

export default SectionCard;
