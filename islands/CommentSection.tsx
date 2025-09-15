import { useState } from "preact/hooks";
import Snackbar from "../components/Snackbar.tsx";
import { Button } from "./Button.tsx";
import RelativeDate from "../components/RelativeDate.tsx";

interface CommentView {
  id: string;
  reportId: string;
  username: string;
  text: string;
  createdAtMillis: number;
}

interface CommentSectionProps {
  reportId: string;
  comments: CommentView[];
  canCreateComment: boolean;
}

export default function CommentSection({
  reportId,
  comments,
  canCreateComment,
}: CommentSectionProps) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setMessage("");

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const res = await fetch(`/report/${reportId}/comment`, {
      method: "POST",
      body: formData,
    });

    const body = await res.json();

    if (!res.ok) {
      const errorMessage = body.message ??
        "Fehler beim Absenden des Kommentars.";
      setMessage(errorMessage);
      globalThis.scrollTo(0, 0);
      setSubmitting(false);
      return;
    }

    location.reload();
  }

  return (
    <div class="text-sm">
      <ul class="space-y-4 mb-8">
        {comments.map((comment) => (
          <li key={comment.id} class="border rounded-md p-3">
            <div class="font-semibold">{comment.username}</div>
            <div class="text-gray-700 mt-1 whitespace-pre-wrap">
              {comment.text}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              <RelativeDate
                unixMillis={comment.createdAtMillis}
              />
            </div>
          </li>
        ))}
      </ul>

      {canCreateComment && (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          class="space-y-6 text-sm"
        >
          <div>
            <label htmlFor="text" class="block font-medium mb-1">
              Neuer Kommentar
            </label>
            <textarea
              id="text"
              name="text"
              required
              placeholder="Dein Kommentar..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={3}
            />
          </div>

          <div class="flex items-center space-x-2">
            <input type="checkbox" name="isAnonym" value="true" id="anonym" />
            <label htmlFor="anonym" class="text-sm">
              Kommentar anonym einreichen
            </label>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Sende..." : "Kommentar absenden"}
          </Button>

          {message && <Snackbar type="error">{message}</Snackbar>}
        </form>
      )}
    </div>
  );
}
