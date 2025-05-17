import type React from "react";
import { useEffect, useState } from "react";
import { fetchGuides } from "../api/guides";
import { Card } from "../components/ui/card";
import type { Guide } from "../types/guide";
import { toast } from "sonner";
import { Input } from "../components/ui/input";

interface AdminPanelProps {
  jwt: string | null;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ jwt }) => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editGuide, setEditGuide] = useState<Guide | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ [id: string]: string }>({});
  const [ratings, setRatings] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGuides(jwt || undefined);
        setGuides(data);
      } catch (e) {
        setError("Failed to load guides");
        toast.error("Failed to load guides");
      } finally {
        setLoading(false);
      }
    };
    loadGuides();
  }, [jwt]);

  const handleEdit = (guide: Guide) => {
    setEditGuide(guide);
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!editGuide) return;
    try {
      await import("../api/guides").then(({ updateGuide }) =>
        updateGuide(editGuide, jwt || undefined)
      );
      toast.success("Guide updated!");
      setEditMode(false);
      setEditGuide(null);
      const data = await fetchGuides(jwt || undefined);
      setGuides(data);
    } catch (e) {
      if ((e as Error)?.message?.startsWith("Validation failed:")) {
        toast.error((e as Error).message, {
          description: "Please review the guide and try again.",
        });
      } else {
        toast.error("Failed to update guide.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await import("../api/guides").then(({ deleteGuide }) =>
        deleteGuide(id, jwt || undefined)
      );
      toast.success("Guide deleted!");
      setGuides((prev) => prev.filter((g) => g.id !== id));
      if (selectedGuide?.id === id) setSelectedGuide(null);
    } catch (e) {
      setError("Failed to delete guide");
      toast.error("Failed to delete guide.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleFeedback = (id: string, value: string) => {
    setFeedback((prev) => ({ ...prev, [id]: value }));
    toast.success("Feedback submitted!");
  };
  const handleRating = (id: string, value: number) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
    toast.success("Rating submitted!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="mb-4 flex gap-2 items-center">
        <Input
          type="text"
          placeholder="Filter guides..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border rounded px-3 py-2"
        />
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-600 font-semibold mb-4">{error}</div>
      ) : filteredGuides.length === 0 ? (
        <div className="text-gray-500">No guides found.</div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filteredGuides.map((guide) => (
            <li key={guide.id}>
              <Card className="p-4 relative">
                <h3 className="text-lg font-semibold mb-1">{guide.title}</h3>
                <p className="text-gray-600 mb-2">{guide.description}</p>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setSelectedGuide(guide)}
                    aria-label={`Review guide: ${guide.title}`}
                  >
                    Review
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 bg-green-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => handleEdit(guide)}
                    aria-label={`Edit guide: ${guide.title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={deletingId === guide.id}
                    onClick={() => handleDelete(guide.id)}
                    aria-label={`Delete guide: ${guide.title}`}
                  >
                    {deletingId === guide.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        ratings[guide.id] >= star ? "" : "opacity-30"
                      }`}
                      onClick={() => handleRating(guide.id, star)}
                      aria-label={`Rate ${star} star${
                        star > 1 ? "s" : ""
                      } for ${guide.title}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    className="border p-1 w-full text-sm"
                    placeholder="Leave feedback..."
                    value={feedback[guide.id] || ""}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        [guide.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) => handleFeedback(guide.id, e.target.value)}
                    aria-label={`Leave feedback for ${guide.title}`}
                  />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {selectedGuide && !editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-2">{selectedGuide.title}</h2>
            <p className="mb-2">{selectedGuide.description}</p>
            <ol className="list-decimal pl-5 mb-4">
              {selectedGuide.steps.map((step, idx) => (
                <li key={`${selectedGuide.id}-step-${idx}`}>{step}</li>
              ))}
            </ol>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded"
              onClick={() => setSelectedGuide(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {editMode && editGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-2">Edit Guide</h2>
            <input
              className="border p-2 mb-2 w-full"
              value={editGuide.title}
              onChange={(e) =>
                setEditGuide({ ...editGuide, title: e.target.value })
              }
            />
            <textarea
              className="border p-2 mb-2 w-full"
              value={editGuide.description}
              onChange={(e) =>
                setEditGuide({ ...editGuide, description: e.target.value })
              }
            />
            <ol className="list-decimal pl-5 mb-2">
              {editGuide.steps.map((step, idx) => (
                <li key={`${editGuide.id}-edit-step-${idx}`}>
                  <input
                    className="border p-1 w-full"
                    value={step}
                    onChange={(e) => {
                      const steps = [...editGuide.steps];
                      steps[idx] = e.target.value;
                      setEditGuide({ ...editGuide, steps });
                    }}
                  />
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => {
                      const steps = editGuide.steps.filter((_, i) => i !== idx);
                      setEditGuide({ ...editGuide, steps });
                    }}
                    aria-label={`Delete step ${idx + 1} from guide: ${
                      editGuide.title
                    }`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="px-2 py-1 bg-blue-500 text-white rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() =>
                setEditGuide({ ...editGuide, steps: [...editGuide.steps, ""] })
              }
              aria-label="Add step"
            >
              Add Step
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={handleSave}
              aria-label="Save guide"
            >
              Save
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setEditMode(false)}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
