"use client";
import { Search } from "lucide-react";
import Form from "next/form";
import SearchFormReset from "./SearchFormReset";
function SearchForm({ query }: { query?: string }) {
  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />
      <div className="flex gap-2">
        {query && <SearchFormReset />}
        <button type="submit" className="search-btn text-white">
          <Search size={20} />
        </button>
      </div>
    </Form>
  );
}

export default SearchForm;
