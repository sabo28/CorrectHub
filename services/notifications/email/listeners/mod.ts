import { ReportCreationNotification } from "./report-creation.ts";
import IEventService from "@domain/event/service.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";
import IEmailTransporter from "../transporter/mod.ts";
import { UserCreationNotification } from "./user-creation.ts";
import StatusChangeNotification from "./report-status-change.ts";
import ReportLifecycleListener from "@domain/report-lifecycle/listener.ts";
import ReportLifecycleService from "@domain/report-lifecycle/service.ts";
import { CommentCreationNotification } from "./comment-creation.ts";
import IUserRepository from "@domain/user/repository.ts";
import { PasswordResetNotification } from "./reset-password.ts";

export default function initializeListeners(
  eventService: IEventService,
  siteConfiguration: SiteConfiguration,
  emailTransporter: IEmailTransporter,
  lifecycleService: ReportLifecycleService,
  userRepository: IUserRepository,
) {
  eventService
    .subscribe(
      new UserCreationNotification(
        siteConfiguration,
        emailTransporter,
      ),
    )
    .subscribe(
      new StatusChangeNotification(
        siteConfiguration,
        emailTransporter,
      ),
    )
    .subscribe(
      new ReportLifecycleListener(lifecycleService),
    )
    .subscribe(
      new CommentCreationNotification(
        siteConfiguration,
        emailTransporter,
        userRepository,
      ),
    )
    .subscribe(
      new ReportCreationNotification(
        siteConfiguration,
        emailTransporter,
        userRepository,
      ),
    )
    .subscribe(
      new PasswordResetNotification(
        siteConfiguration,
        emailTransporter,
      ),
    );
}
