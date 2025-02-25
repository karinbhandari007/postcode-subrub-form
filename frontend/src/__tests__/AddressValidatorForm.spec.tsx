import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import AddressValidatorForm from "../components/AddressValidatorForm";
import { CHECK_ADDRESS } from "../graphql/queries";
import "@testing-library/jest-dom";

const mocksWithCompleteMatch = [
  {
    request: {
      query: CHECK_ADDRESS,
      variables: {
        searchQuery: "2000",
        state: "NSW",
      },
    },
    result: {
      data: {
        checkAddress: {
          __typename: "AddressValidationResponse",
          isValid: true,
          errorMessage: "",
          localities: [
            {
              __typename: "Locality",
              category: "Delivery Area",
              id: 123,
              latitude: -33.865143,
              location: "SYDNEY",
              longitude: 151.2099,
              postcode: 2000,
              state: "NSW",
            },
          ],
        },
      },
    },
    error: undefined,
  },
];

const mocksWithReturnStateDiff = [
  {
    request: {
      query: CHECK_ADDRESS,
      variables: {
        searchQuery: "2000",
        state: "NSW",
      },
    },
    result: {
      data: {
        checkAddress: {
          __typename: "AddressValidationResponse",
          isValid: true,
          errorMessage: "",
          localities: [
            {
              __typename: "Locality",
              category: "Delivery Area",
              id: 123,
              latitude: -33.865143,
              location: "SYDNEY",
              longitude: 151.2099,
              postcode: 2000,
              state: "TAS",
            },
          ],
        },
      },
    },
    error: undefined,
  },
];

describe("AddressValidatorForm", () => {
  const renderComponent = (mock: any) =>
    render(
      <MockedProvider mocks={mock} addTypename={false}>
        <AddressValidatorForm />
      </MockedProvider>
    );

  it("renders the form correctly", () => {
    renderComponent(mocksWithCompleteMatch);

    expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/suburb/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows loading state during submission", async () => {
    renderComponent(mocksWithCompleteMatch);

    fireEvent.change(screen.getByLabelText(/postcode/i), {
      target: { value: "2000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("verify that the entered postcode aligns with the specified suburb", async () => {
    renderComponent(mocksWithCompleteMatch);

    fireEvent.change(screen.getByLabelText(/postcode/i), {
      target: { value: "2000" },
    });
    fireEvent.change(screen.getByLabelText(/suburb/i), {
      target: { value: "Melbourne" },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: "NSW" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(
      screen.getByText(/The postcode 2000 does not match the suburb Melbourne/i)
    ).toBeInTheDocument();
  });

  it("confirm that the inputted suburb is consistent with the selected state", async () => {
    renderComponent(mocksWithReturnStateDiff);

    fireEvent.change(screen.getByLabelText(/postcode/i), {
      target: { value: "2000" },
    });
    fireEvent.change(screen.getByLabelText(/suburb/i), {
      target: { value: "Sydney" },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: "NSW" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(
      screen.getByText(/The suburb Sydney does not exist in the state NSW/i)
    ).toBeInTheDocument();
  });

  it("postcode, suburb, and state align correctly", async () => {
    renderComponent(mocksWithCompleteMatch);

    fireEvent.change(screen.getByLabelText(/postcode/i), {
      target: { value: "2000" },
    });
    fireEvent.change(screen.getByLabelText(/suburb/i), {
      target: { value: "Sydney" },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: "NSW" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(
      screen.getByText(/The postcode, suburb, and state input are valid/i)
    ).toBeInTheDocument();
  });
});
