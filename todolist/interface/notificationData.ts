export interface NotificationData {
    text: string
    type: NotificationTypeEnum
}
export declare enum NotificationTypeEnum {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    DANGER = "danger"
}