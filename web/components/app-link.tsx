import Link from "next/link";
import type { ComponentProps } from "react";

/** next/link tagged as an in-app navigation, which is what triggers the page transition. */
export function AppLink(props: Omit<ComponentProps<typeof Link>, "transitionTypes">) {
  return <Link {...props} transitionTypes={["nav"]} />;
}
