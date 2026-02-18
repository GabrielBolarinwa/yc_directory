import { z } from "zod";
export const formSchema = z.object({
  title: z.string().min(3).max(500),
  description: z.string().min(20).max(200),
  category: z.string().min(3).max(20),
  link: z.url().refine(async (url) => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      const contentType = res.headers.get("content-type");
      return contentType?.startsWith("image/");
    } catch (err) {
      console.log(err);
      return false;
    }
  }),
  pitch: z.array(
    z.object({
      children: z.array(
        z.object({
          text: z.string(),
        }),
      ),
      markDefs: z.array(z.object()),
      style: z.string(),
      _key: z.string(),
      _type: z.string(),
    }),
  ),
});
