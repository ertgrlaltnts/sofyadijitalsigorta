import type { ReactNode } from "react";
import type { StepId } from "@/lib/quote-flow";
import { AccidentCoverStep, HealthCoverStep, HealthProfileStep } from "./health-steps";
import { PersonStep } from "./person-step";
import { AddressStep, BuildingStep, SumsStep } from "./property-steps";
import type { StepProps } from "./step-props";
import { TravelStep } from "./travel-step";
import { ImmStep, VehicleDetailsStep, VehicleStep } from "./vehicle-steps";

/** The screen of one step. A function that returns elements (not a chosen component), so each step keeps its own state. */
export function renderStep(step: StepId, props: StepProps): ReactNode {
  switch (step) {
    case "cover":
      return props.product === "health" ? <HealthCoverStep {...props} /> : <AccidentCoverStep {...props} />;
    case "profile":
      return <HealthProfileStep {...props} />;
    case "vehicle":
      return <VehicleStep {...props} />;
    case "vehicle-details":
      return <VehicleDetailsStep {...props} />;
    case "imm":
      return <ImmStep {...props} />;
    case "address":
      return <AddressStep {...props} />;
    case "building":
      return <BuildingStep {...props} />;
    case "sums":
      return <SumsStep {...props} />;
    case "travel":
      return <TravelStep {...props} />;
    case "person":
      return <PersonStep {...props} />;
  }
}
