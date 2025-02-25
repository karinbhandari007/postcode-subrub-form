"use client";

import { FunctionComponent, ReactElement, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { CHECK_ADDRESS } from "../graphql/queries"; // Ensure the query is correctly set
import { AddressFormStateType, LocalityType } from "@/types/common";

const formInitialState: AddressFormStateType = {
  error: false,
  data: {
    postCode: "",
    suburb: "",
    state: "",
  },
  message: "",
};

const AddressValidatorForm: FunctionComponent = (): ReactElement => {
  const [checkAddress, { loading }] = useLazyQuery(CHECK_ADDRESS);

  const [formState, setFormState] =
    useState<AddressFormStateType>(formInitialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const postcode = formData.get("postCode")?.toString() || "";
    const suburb = formData.get("suburb")?.toString() || "";
    const state = formData.get("state")?.toString() || "";
    const searchQuery = postcode?.length ? postcode : suburb;

    try {
      // API call
      const resp = await checkAddress({
        variables: {
          searchQuery,
          state,
        },
      });

      const { isValid, errorMessage } = resp?.data?.checkAddress;

      // If there was an issue with the address, handling it here
      if (!isValid) {
        setFormState({
          ...formState,
          error: true,
          message: errorMessage,
        });
        return;
      }

      // Now validating the postcode and suburb
      const localities = resp?.data?.checkAddress?.localities ?? [];

      if (localities && localities.length > 0) {
        // Check for Complete Match: Postcode, Suburb, and State
        const allMatched = localities.find(
          (locality: LocalityType) =>
            locality.postcode.toString().toLowerCase() ===
              postcode.toString().toLowerCase() &&
            locality.location.toLowerCase() === suburb.toLowerCase() &&
            locality.state.toLowerCase() === state.toLowerCase()
        );

        if (allMatched) {
          setFormState({
            ...formState,
            error: false,
            message: "The postcode, suburb, and state input are valid.",
          });
          return;
        }

        // Check for Matching Suburb and Postcode, but wrong state
        const matchingSuburbForState = localities.find(
          (locality: LocalityType) =>
            locality.postcode.toString().toLowerCase() ===
              postcode.toString().toLowerCase() &&
            locality.location.toLowerCase() === suburb.toLowerCase() &&
            locality.state.toLowerCase() !== state.toLowerCase()
        );

        if (matchingSuburbForState) {
          setFormState({
            ...formState,
            error: true,
            message: `The suburb ${suburb} does not exist in the state ${state}.`,
          });
          return;
        }

        // Check for Matching Postcode and State, but wrong Suburb
        const matchingPostcodeForSuburb = localities.find(
          (locality: LocalityType) =>
            locality.postcode.toString().toLowerCase() ===
              postcode.toString().toLowerCase() &&
            locality.location.toLowerCase() !== suburb.toLowerCase() &&
            locality.state.toLowerCase() === state.toLowerCase()
        );

        if (matchingPostcodeForSuburb) {
          setFormState({
            ...formState,
            error: true,
            message: `The postcode ${postcode} does not match the suburb ${suburb}.`,
          });
          return;
        }

        throw new Error("Validation Error!");
      } else {
        // No localities returned
        setFormState({
          ...formState,
          error: true,
          message: `No matching data found for postcode ${postcode} and suburb ${suburb}.`,
        });
      }
    } catch {
      setFormState({
        ...formState,
        error: true,
        message:
          "An error occurred during address validation. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg min-w-80">
      <h2 className="text-2xl font-bold text-center mb-6">Address Validator</h2>

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="form">
        <div>
          <label
            htmlFor="postCode"
            className="block text-sm font-medium text-gray-700"
          >
            Postcode:
          </label>
          <input
            type="text"
            id="postCode"
            name="postCode"
            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="suburb"
            className="block text-sm font-medium text-gray-700"
          >
            Suburb:
          </label>
          <input
            type="text"
            id="suburb"
            name="suburb"
            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State:
          </label>
          <input
            type="text"
            id="state"
            name="state"
            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {formState.message && (
          <div
            className={`mt-4 text-center ${
              formState.error ? "text-red-500" : "text-green-500"
            }`}
          >
            {formState.message}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressValidatorForm;
