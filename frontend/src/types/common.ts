/**
 * Represents a geographical locality with its associated details
 */
export type LocalityType = {
  category: string;
  id: number;
  latitude?: number;
  location: string;
  longitude?: number;
  postcode: number;
  state: string;
};

/**
 * Represents the state of an address validation form
 */
export type AddressFormStateType = {
  error: boolean;
  data: {
    postCode: string;
    suburb: string;
    state: string;
  };
  message: string;
};
