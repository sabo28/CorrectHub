import { useState } from "preact/hooks";
import { Button } from "../islands/Button.tsx";

export default function CommentForm() {
  const [comment, setComment] = useState("");

  return (
    <form class="space-y-4">
      <div>
        <label htmlFor="comment" class="block font-medium mb-1">
          Kommentar
        </label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Schreibe hier einen Kommentar"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows={4}
          value={comment}
          onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
        />
      </div>
      <div class="flex justify-end">
        <Button type="submit" variant="primary">
          Absenden
        </Button>
      </div>
    </form>
  );
}
