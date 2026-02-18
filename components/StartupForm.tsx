"use client";
import { formSchema } from "@/lib/validation";
import { markdownToPortableText } from "@portabletext/markdown";
import MDEditor from "@uiw/react-md-editor";
import { Send } from "lucide-react";
import { Any, PortableTextBlock } from "next-sanity";
import { useActionState, useState } from "react";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { errors } from "@/types/startupForm";
import { createPitch } from "@/lib/actions";

function StartupForm() {
  const [errors, setErrors] = useState<errors | undefined>({});
  const [value, setValue] = useState<string>("**Hello World**");
  const [pitch, setPitch] = useState(markdownToPortableText(value));
  const router = useRouter();
  const handleFormSubmit = async (prevState: Any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };
      const errorResult = await formSchema.safeParseAsync(formValues);
      if (errorResult.error) {
        const tree = z.treeifyError(errorResult.error);

        const fieldErrors = tree?.properties;
        setErrors(fieldErrors);

        if (fieldErrors) {
          toast.error("Error", {
            description: "Validation failed, please check your inputs",

            style: {
              background: "red",
            },
          });
        }
        return {
          ...prevState,
          error: "Validation failed",
          status: "Error",
        };
      }

      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast.success("Success", {
          description: "Your startup pitch has been created successfully",
          style: {
            background: "green",
          },
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      toast.error("Error", {
        description: `An expected error has occurred ${error}`,

        style: {
          background: "red",
        },
      });
      return {
        ...prevState,
        error: `An expected error has occurred ${error}`,
        status: "Error",
      };
    }
  };
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });
  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          placeholder="Startup Title"
          required
        />
        {errors?.title?.errors && (
          <p className="startup-form_error">{errors?.title?.errors[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_input"
          placeholder="Startup Description"
          required
        />
        {errors?.description?.errors && (
          <p className="startup-form_error">{errors?.description?.errors[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          placeholder="Startup Category (Tech, Health, Education ...)"
          required
        />
        {errors?.category?.errors && (
          <p className="startup-form_error">{errors.category.errors[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          placeholder="Startup Image URL"
          required
        />
        {errors?.link?.errors && (
          <p className="startup-form_error">{errors.link.errors[0]}</p>
        )}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={value}
          onChange={(value) => {
            setValue(value as string);
            setPitch(markdownToPortableText(value as string));
          }}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your pitch and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors?.pitch?.errors && (
          <p className="startup-form_error">
            Invalid Pitch, check content for invalid markdown syntax
          </p>
        )}
      </div>
      <Button type="submit" className="startup-form_btn" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit your Pitch"}
        <Send size={96} className="mt-2" />
      </Button>
    </form>
  );
}

export default StartupForm;
