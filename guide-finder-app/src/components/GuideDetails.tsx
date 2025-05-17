import { GuideAccordion } from "./ui/accordion";
import type { Guide } from "../types/guide";

interface GuideDetailsProps {
  guide: Guide | null;
}

const GuideDetails: React.FC<GuideDetailsProps> = ({ guide }) => {
  if (!guide) {
    return <div>Select a guide to see the details.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{guide.title}</h2>
      <p className="mb-4 text-gray-700">{guide.description}</p>
      <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
      <GuideAccordion steps={guide.steps} guideId={guide.id} />
    </div>
  );
};

export default GuideDetails;
