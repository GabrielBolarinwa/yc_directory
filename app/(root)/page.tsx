import StartupCard, { StartupCardType } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import SearchForm from "../../components/SearchForm";
import { ContentSourceMap } from "next-sanity";
import { Suspense } from "react";

export default function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  return (
    <Suspense>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const { data: posts } = (await sanityFetch({
    query: STARTUPS_QUERY,
    params,
  })) as {
    data: StartupCardType[];
    sourceMap: ContentSourceMap | null;
    tags: string[];
  };
  return (
    <>
      <section className="pink_container pattern">
        <h1 className="heading">
          Pitch Your Startup
          <br />
          Connect with Enterpreneurs
        </h1>
        <p className="sub-heading">
          Submit Ideas, Vote on Pitchs, Get Noticed in Virtual Competitions.
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search Results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post) => <StartupCard key={post?._id} post={post} />)
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
