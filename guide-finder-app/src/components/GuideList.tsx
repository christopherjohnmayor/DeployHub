import React, { type FC } from "react";
import type { Guide } from "../types/guide";
import { Card } from "./ui/card";

interface GuideListProps {
  guides: Guide[];
  onSelectGuide: (guide: Guide) => void;
}

const GuideList: FC<GuideListProps> = ({ guides, onSelectGuide }) => {
  return (
    <div>
      <h2>Available Guides</h2>
      <ul className="grid gap-4 md:grid-cols-2" aria-label="Available Guides">
        {guides.map((guide) => (
          <li key={guide.id}>
            <Card className="p-4">
              <button
                type="button"
                onClick={() => onSelectGuide(guide)}
                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:shadow-lg transition-shadow rounded"
                aria-label={`View details for ${guide.title}`}
              >
                <h3 className="text-lg font-semibold mb-1">{guide.title}</h3>
                <p className="text-gray-600">{guide.description}</p>
              </button>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuideList;
