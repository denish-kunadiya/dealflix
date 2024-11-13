import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';

const customSegmentTitleByKey = {
  orders: 'order',
  report: 'property report',
};

const calcSegmentTitle = (segment: string) => {
  return (
    customSegmentTitleByKey[segment as keyof typeof customSegmentTitleByKey] ||
    segment.replace('-', ' ')
  );
};

const SectionBreadcrumb = () => {
  const rootSegment = 'orders';
  const pathName = usePathname();
  const allSegments = pathName.split('/').filter(Boolean);
  const orderSegmentIndex = allSegments.findIndex((item) => item === rootSegment);
  const orderIdSegment = allSegments[orderSegmentIndex + 1];
  const basePath = `/${rootSegment}/${orderIdSegment}`;
  const subPath = pathName.split(`${basePath}/`)[1] || '';
  const nextSegments = (subPath.split('/') || []).filter(Boolean);

  const segments = [rootSegment, ...nextSegments];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.length > 1 &&
          segments.map((segment, index) => {
            const nextHref = segment !== rootSegment ? `${basePath}/${segment}` : basePath;
            return (
              <Fragment key={segment}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="capitalize"
                  >
                    {index < segments.length - 1 ? (
                      <Link href={nextHref}>{calcSegmentTitle(segment)}</Link>
                    ) : (
                      <BreadcrumbPage>{calcSegmentTitle(segment)}</BreadcrumbPage>
                    )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < segments.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SectionBreadcrumb;
