// Shadcn-ui Card component placeholder. Replace with the official code from https://ui.shadcn.com/docs/components/card
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
Card.displayName = "Card";

export { Card };
