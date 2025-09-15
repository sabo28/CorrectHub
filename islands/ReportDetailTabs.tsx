import { useState } from "preact/hooks";
import { IPrimitiveReportLifecycleEvent } from "@domain/report-lifecycle/report-lifecycle-event.ts";
import { IPrimitiveComment } from "@domain/comment/comment.ts";
import CommentSection from "./CommentSection.tsx";
import ReportEventItem from "./ReportEventItem.tsx";

interface IReportDetailTabsProps {
  reportId: string;
  events: IPrimitiveReportLifecycleEvent[];
  comments: IPrimitiveComment[];
  canCreateComment: boolean;
}

export default function ReportDetailTabs(props: IReportDetailTabsProps) {
  const tabs = ["Kommentare", "Verlauf"];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div class="w-full max-w-xl mx-auto">
      <div class="flex border-b border-gray-200">
        {tabs.map((tab, tabIndex) => (
          <a
            key={tab}
            class={`py-2 px-4 text-sm cursor-pointer font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tabIndex
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab(tabIndex)}
          >
            {tab}
          </a>
        ))}
      </div>

      <div class="py-4">
        <div class={activeTab === 0 ? "visible" : "hidden"}>
          <CommentSection
            reportId={props.reportId}
            comments={props.comments}
            canCreateComment={props.canCreateComment}
          />
        </div>

        <div class={activeTab === 1 ? "visible" : "hidden"}>
          {props.events.map((event) => (
            <ReportEventItem
              key={event.id}
              event={event}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
