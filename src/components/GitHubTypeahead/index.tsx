"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { useDebounce, useAutoComplete } from "@/hooks";

import styles from "./GitHubTypeahead.module.css";

export interface User {
  id: number;
  login: string;
  avatar_url: string;
}

const GitHubTypeahead: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [suggestionClicked, setSuggestionClicked] = useState(false);

  const debouncedSuggestionsQuery = useDebounce(query, 300);
  const debouncedGitHubTypeaheadQuery = useDebounce(query, 1500);

  const { suggestions } = useAutoComplete(debouncedSuggestionsQuery);

  const getGitHubTypeahead = async (query: string) => {
    try {
      const response = await fetch(`/api/search?query=${query}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data from GitHub");
      }

      const userData: User[] = await response.json();

      setUser(userData[0]);
    } catch (error) {
      setUser(null);
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setSuggestionClicked(false);

    if (inputValue === "") {
      setUser(null);
    }
  };

  useEffect(() => {
    if (debouncedGitHubTypeaheadQuery) {
      getGitHubTypeahead(debouncedGitHubTypeaheadQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGitHubTypeaheadQuery]);

  const handleSuggestionClick = (login: string) => {
    setQuery(login);
    setSuggestionClicked(true);
  };

  return (
    <div className={styles["github-typeahead"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getGitHubTypeahead(debouncedGitHubTypeaheadQuery);
        }}
      >
        <input
          type="text"
          placeholder="Search GitHub users"
          value={query}
          onChange={handleInputChange}
          className={styles.input}
        />
        {!suggestionClicked && suggestions && suggestions.length > 0 && (
          <ul>
            {suggestions.map(({ login }) => (
              <li key={login} onClick={() => handleSuggestionClick(login)}>
                {login}
              </li>
            ))}
          </ul>
        )}
      </form>

      {user && (
        <a
          href={`https://github.com/${user.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.selectedUser}
        >
          <div className={styles.avatarContainer}>
            <Image
              src={user.avatar_url}
              alt={`${user.login} avatar`}
              width={100}
              height={100}
            />
          </div>
          <div className={styles.userInfo}>{user.login}</div>
        </a>
      )}
    </div>
  );
};

export default GitHubTypeahead;
