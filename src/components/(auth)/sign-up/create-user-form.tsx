'use client';

import { useState } from 'react';

import { TUserGeneralInfoSchema } from '@/utils/api/schemas/profile';

import UserGeneralInfoForm from './user-general-info-form';
import UserSensitiveDataForm from './user-sensitive-data-form';

interface LatLong {
  latitude: number;
  longitude: number;
}

const CreateUserForm = () => {
  const [userGeneralInfo, setUserGeneralInfo] = useState<TUserGeneralInfoSchema>({
    firstName: '',
    lastName: '',
    postalCode: '',
  });
  const [latLong, setLatLong] = useState<LatLong>({
    latitude: 0,
    longitude: 0,
  });

  const [isSecondStep, setIsSecondStep] = useState(false);

  const handleSaveUserGeneralInfo = (data: TUserGeneralInfoSchema) => {
    setUserGeneralInfo(data);

    setIsSecondStep(true);
  };

  return (
    <>
      {!isSecondStep ? (
        <UserGeneralInfoForm
          onSaveData={handleSaveUserGeneralInfo}
          setLatLong={setLatLong}
        />
      ) : (
        <UserSensitiveDataForm
          userGeneralInfo={userGeneralInfo}
          latLong={latLong}
        />
      )}
    </>
  );
};

export default CreateUserForm;
