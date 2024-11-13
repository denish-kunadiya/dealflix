const formatPhoneNumber = (phoneNumberString: string) => {
  const cleaned = ('' + phoneNumberString).replace(/\\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '+1 (' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

export interface OnsiteContactInfoProps {
  name: string;
  phone?: string;
  email?: string;
}

const OnsiteContactInfo = ({ name, phone, email }: OnsiteContactInfoProps) => {
  const phoneFormatted = phone && formatPhoneNumber(phone);
  return (
    <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
      <p className="text-sm font-normal text-slate-400">{name}</p>
      {phone && <p className="text-sm font-normal text-sky-500">{phoneFormatted}</p>}
      {!phone && email && <p className="text-sm font-normal text-sky-500">{email}</p>}
    </div>
  );
};

export default OnsiteContactInfo;
