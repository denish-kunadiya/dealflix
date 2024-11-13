import SectionTitle, { ISectionTitleProps } from './section-title';
import SectionBreadcrumb from './section-breadcrumb';

interface ISectionHeaderProps extends ISectionTitleProps {
  children?: React.ReactNode;
}

const SectionHeader = ({ title, description, orderStatus, children }: ISectionHeaderProps) => {
  return (
    <header className="">
      <div className="mb-8">{<SectionBreadcrumb />}</div>
      <div className="mb-[60px] flex justify-between space-x-5">
        <SectionTitle
          title={title}
          description={description}
          orderStatus={orderStatus}
        />
        {children}
      </div>
    </header>
  );
};

export default SectionHeader;
