import { gql } from "@apollo/client";

/**
 * GraphQL query to validate an address and get matching localities
 * @param searchQuery - The address string to search for
 * @param state - The state to search within
 * @returns {Object} Response containing:
 *   - isValid: Whether the address is valid
 *   - errorMessage: Error message if validation fails
 *   - localities: Array of matching localities with details like:
 *     - category: Type of locality
 *     - id: Unique identifier
 *     - latitude: Geographic latitude
 *     - location: Location name/description
 *     - longitude: Geographic longitude
 *     - postcode: Postal code
 *     - state: State name
 */
export const CHECK_ADDRESS = gql`
  query CheckAddress($searchQuery: String!, $state: String!) {
    checkAddress(searchQuery: $searchQuery, state: $state) {
      isValid
      errorMessage
      localities {
        category
        id
        latitude
        location
        longitude
        postcode
        state
      }
    }
  }
`;
