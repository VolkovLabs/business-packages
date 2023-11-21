/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Global Constant
 */
const GLOBAL_CONSTANT = {};

/**
 * Global Function
 */
const func = () => {
  /**
   * Local Variable
   */
  const localVariable = 'hello';

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
const ADMIN_USER = {
  firstName: 'John',
};

/**
 * Non matched external property
 */
interface ThirdPartyObject {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Name: string;
}

/**
 * Now it's not solved - https://github.com/typescript-eslint/typescript-eslint/issues/2160
 */
const THIRD_PARTY_OBJECT: ThirdPartyObject = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Name: 'john',
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
const Component = () => null;
