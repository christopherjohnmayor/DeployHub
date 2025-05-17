import React, { useState, useEffect, type FC } from "react";
import SearchBar from "../components/SearchBar";
import GuideList from "../components/GuideList";
import { fetchGuides } from "../api/guides";
import { fetchMissingInstructions } from "../api/aiFetch";
import type { Guide } from "../types/guide";
import { toast } from "sonner";

interface HomeProps {
  onSelectGuide: (guide: Guide) => void;
}

const Home: FC<HomeProps> = ({ onSelectGuide }) => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedGuides = await fetchGuides();
        setGuides(fetchedGuides);
      } catch (e) {
        setError("Failed to load guides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);
    try {
      const fetchedGuides = await fetchGuides();
      const filtered = fetchedGuides.filter(
        (guide) =>
          guide.title.toLowerCase().includes(query.toLowerCase()) ||
          guide.description.toLowerCase().includes(query.toLowerCase())
      );
      setGuides(filtered);
      if (filtered.length === 0) {
        toast("No guides found. You can request AI to generate a new guide.");
      }
    } catch (e) {
      setError("Failed to search guides. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIGuideRequest = async () => {
    toast("Generating guide with AI...");
    try {
      const newGuide = await fetchMissingInstructions(searchQuery);
      // Ensure the new guide has a unique id
      const guideWithId: Guide = {
        id: String(Date.now()),
        title: newGuide.title,
        description: newGuide.description,
        steps: newGuide.steps,
      };
      setGuides((prev) => [...prev, guideWithId]);
      toast.success("AI-generated guide added!");
    } catch (e) {
      if ((e as Error)?.message?.startsWith("Validation failed:")) {
        toast.error((e as Error).message, {
          description: "Please review the generated guide and try again.",
        });
      } else {
        toast.error("Failed to generate guide with AI.");
      }
    }
  };

  return (
    <main aria-label="Guide Finder Main Content">
      <h1 className="mb-4 text-3xl font-bold" tabIndex={-1}>
        Guide Finder
      </h1>
      <SearchBar onSearch={handleSearch} />
      {error && (
        <div
          className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-300"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {loading ? (
        <div
          className="grid gap-4 md:grid-cols-2"
          aria-busy="true"
          aria-live="polite"
          aria-label="Loading guides"
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-32 rounded"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <GuideList guides={guides} onSelectGuide={onSelectGuide} />
      )}
      {guides.length === 0 && !loading && !error && (
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleAIGuideRequest}
          aria-label="Generate a new guide using AI assistance"
        >
          Generate Guide with AI
        </button>
      )}
    </main>
  );
};

export default Home;
