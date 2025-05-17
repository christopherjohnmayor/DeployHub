import {
  Accordion as RadixAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

export interface GuideAccordionProps {
  steps: string[];
  guideId: string;
}

export const GuideAccordion: React.FC<GuideAccordionProps> = ({
  steps,
  guideId,
}) => (
  <RadixAccordion type="single" collapsible className="border rounded divide-y">
    {steps.map((step) => (
      <AccordionItem
        value={`step-${step.slice(0, 10)}`}
        key={`${guideId}-step-${step.slice(0, 10)}`}
        className="border-b last:border-b-0"
      >
        <AccordionTrigger className="font-medium mb-1">Step</AccordionTrigger>
        <AccordionContent>{step}</AccordionContent>
      </AccordionItem>
    ))}
  </RadixAccordion>
);
