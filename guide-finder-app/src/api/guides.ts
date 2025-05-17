import { Guide } from "../types/guide";

export const fetchGuides = async (jwt?: string): Promise<Guide[]> => {
  const response = await fetch("/api/guides", {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });
  if (!response.ok) throw new Error("Failed to fetch guides");
  return await response.json();
};

export const addGuide = async (guide: Guide, jwt?: string): Promise<void> => {
  const { valid, errors } = validateGuide(guide);
  if (!valid) throw new Error(`Validation failed: ${errors.join(" ")}`);
  const response = await fetch("/api/guides", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify(guide),
  });
  if (!response.ok) throw new Error("Failed to add guide");
};

export const updateGuide = async (
  guide: Guide,
  jwt?: string
): Promise<void> => {
  const { valid, errors } = validateGuide(guide);
  if (!valid) throw new Error(`Validation failed: ${errors.join(" ")}`);
  const response = await fetch(`/api/guides/${guide.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify(guide),
  });
  if (!response.ok) throw new Error("Failed to update guide");
};

export const deleteGuide = async (id: string, jwt?: string): Promise<void> => {
  const response = await fetch(`/api/guides/${id}`, {
    method: "DELETE",
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });
  if (!response.ok) throw new Error("Failed to delete guide");
};

// Basic validation for AI-generated guides
export function validateGuide(guide: Partial<Guide>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (
    !guide.title ||
    typeof guide.title !== "string" ||
    guide.title.trim().length < 5
  ) {
    errors.push("Title must be at least 5 characters.");
  }
  if (
    !guide.description ||
    typeof guide.description !== "string" ||
    guide.description.trim().length < 10
  ) {
    errors.push("Description must be at least 10 characters.");
  }
  if (!Array.isArray(guide.steps) || guide.steps.length < 2) {
    errors.push("Guide must have at least 2 steps.");
  } else if (
    guide.steps.some(
      (step) => typeof step !== "string" || step.trim().length < 5
    )
  ) {
    errors.push("Each step must be a string of at least 5 characters.");
  }
  return { valid: errors.length === 0, errors };
}

export const searchGuides = async (query: string): Promise<Guide[]> => {
  const guides = await fetchGuides();
  return guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(query.toLowerCase()) ||
      guide.description.toLowerCase().includes(query.toLowerCase())
  );
};
