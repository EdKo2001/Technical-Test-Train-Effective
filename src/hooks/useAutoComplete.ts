import { useEffect, useState } from "react";

interface Suggestion {
  login: string;
}

const useAutoComplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/autocomplete?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data.suggestions);
        })
        .catch((error) => {
          console.error("Failed to fetch suggestions:", error);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return { suggestions };
};

export default useAutoComplete;
