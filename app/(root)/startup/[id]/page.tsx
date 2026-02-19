/* eslint-disable @next/next/no-img-element */
import StartupCard, { StartupCardType } from "@/components/StartupCard";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { PortableText } from "next-sanity";
import { unstable_noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  unstable_noStore();
  const id = (await params).id;
  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
  ]);
  if (!post) {
    return notFound();
  }
  return (
    <>
      <section className="section_container">
        <section className="pink_container min-h-57.5!">
          <p className="tag">{formatDate(post?._createdAt)}</p>
          <h1 className="heading">{post.title}</h1>
          <p className="sub-heading max-w-5xl!">{post.description}</p>
        </section>
        <div className="section_container">
          <img src={post.image} alt="Startup Image" className="w-full h-auto" />
        </div>
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author?.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16 medium text-black-300!">
                  @{post.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {post.pitch ? (
            <article className="prose max-w-4xl font-work-sans b">
              <PortableText value={post.pitch} />
            </article>
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupCardType, index: number) => (
                <StartupCard key={index} post={post} />
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}
