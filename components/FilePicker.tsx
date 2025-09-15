import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import Message from "./Message.tsx";
import { MdClose } from "react-icons/md";

interface FilePickerProps {
  maxFileSizeInKb?: number;
  acceptedMime?: string[];
  onChange?: (files: File[]) => void;
}

interface DummyFile {
  size: number;
  name: string;
  dummy: true;
  error: string;
}

export default function FilePicker(props: FilePickerProps) {
  const [files, setFiles] = useState<(File | DummyFile)[]>([]);
  const [focused, setFocused] = useState<boolean>(false);
  const maxFileSizeInKb = props.maxFileSizeInKb ?? 1024; // 1MB
  const acceptedMime = props.acceptedMime ??
    ["image/png", "image/jpeg", "image/gif"];

  const propagateFiles = (files: (File | DummyFile)[]) => {
    if (!props.onChange) {
      return;
    }

    const filtered = files.filter((file) => {
      return (file as DummyFile).dummy !== true;
    }) as File[];

    props.onChange(filtered);
  };

  const handleInputChange = (e: Event) => {
    e.preventDefault();

    const input = e.currentTarget as HTMLInputElement;
    if (!input.files) return;

    const newFiles: (File | DummyFile)[] = [];

    for (const file of input.files) {
      if (file.size > maxFileSizeInKb * 1024) {
        newFiles.push({
          name: file.name,
          size: file.size,
          dummy: true,
          error: "Datei zu groß!",
        } as DummyFile);
        continue;
      }

      newFiles.push(file);
    }

    const combined = [...files, ...newFiles];
    setFiles(combined);
    propagateFiles(combined);
    input.value = "";
  };

  const handleRemove = (name: string) => {
    const newFiles = files.filter((file) => file.name !== name);
    setFiles(newFiles);
    propagateFiles(newFiles);
  };

  return (
    <label
      class={`block w-full border rounded ${
        focused ? "outline outline-2 outline-blue-700 -outline-offset-2" : ""
      }`}
    >
      <input
        type="file"
        disabled={!IS_BROWSER}
        accept={acceptedMime.join(",")}
        onChange={handleInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiple
        class="absolute opacity-0"
        style="left: -100px"
      />
      {renderFiles(files, handleRemove)}
      <Message border={false} class="cursor-pointer">
        {files.length
          ? (
            <>
              Klicke <strong>hier</strong> um weitere Screenshots hochzuladen
            </>
          )
          : (
            <>
              Klicke <strong>hier</strong> um Screenshots hochzuladen
            </>
          )}
      </Message>
    </label>
  );
}

function FileItem(
  props: {
    name: string;
    size: number;
    dummy: boolean;
    error?: string;
    onRemove: (name: string) => void;
  },
) {
  const colorClasses = props.dummy
    ? "bg-red-50 text-red-700"
    : "bg-blue-50 text-blue-700";
  return (
    <div class={"flex items-center gap-2 p-4 " + colorClasses}>
      <div class="flex-1">
        {props.name}{" "}
        <span class="text-sm">
          ({(props.size / 1024 / 1024).toFixed(2)} MB)
        </span>
      </div>
      {props.error
        ? (
          <div>
            <span class="text-sm font-bold">{props.error}</span>
          </div>
        )
        : null}
      <a
        href="#"
        onClick={() => props.onRemove(props.name)}
      >
        <MdClose />
      </a>
    </div>
  );
}

function renderFiles(
  files: (File | DummyFile)[],
  handleRemove: (name: string) => void,
) {
  if (!files.length) {
    return null;
  }

  return (
    <ul>
      {files.map((file) => (
        <li key={file.name}>
          <FileItem
            name={file.name}
            size={file.size}
            dummy={(file as DummyFile).dummy ?? false}
            error={(file as DummyFile).error}
            onRemove={(name) => handleRemove(name)}
          />
        </li>
      ))}
    </ul>
  );
}
