import AddressValidatorForm from "@/components/AddressValidatorForm";
import { FunctionComponent, ReactElement } from "react";

const Home: FunctionComponent = (): ReactElement => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <AddressValidatorForm />
    </div>
  );
};

export default Home;
