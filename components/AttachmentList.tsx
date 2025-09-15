export interface IAttachmentListProps {
  attachments: string[];
}

export default function AttachmentList(props: IAttachmentListProps) {
  if (!props.attachments.length) {
    return null;
  }

  return (
    <>
      <ul class="flex flex-wrap gap-3 my-4">
        {props.attachments.map((a) => (
          <li key={a}>
            <div class="w-16 h-16 overflow-hidden rounded border">
              <a href={`/attachment/${a}`} target="_blank">
                <img
                  class="w-full h-full object-cover"
                  src={`/attachment/${a}`}
                  alt="Anhang"
                />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
