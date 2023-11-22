import React from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Constant
 */
const globalConstant = {};

/**
 * Global Function
 */
const func = () => {
  /**
   * Local Variable
   */
  const localVariable = 'hello';

  const func = () => {};

  return localVariable.trim();
};

/**
 * Enum
 */
enum Status {
  ACTIVE = 'active',
  PAUSED = 'paused',
}

/**
 * Type
 */
type User = object;

/**
 * Interface
 */
interface UserObject {}

/**
 * Generic Type
 */
type ApiResponse<TData> = {
  data: TData;
};

/**
 * Property
 */
const adminUser = {
  firstName: 'John',
};

/**
 * Non matched external property
 */
interface ThirdPartyObject {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'custom-name': string;
}

const ThirdPartyObject: ThirdPartyObject = {
  'custom-name': 'john',
};

/**
 * Destructing
 */
const printName = () => {
  const { firstName } = { firstName: 'John' };
};

/**
 * Class
 */
class Service {}

export const service = new Service();

/**
 * Component
 */
const Component: React.FC<null> = () => {
  const onChange = () => {};

  return <input onChange={onChange} dangerouslySetInnerHTML={{ __html: '' }} />;
};
