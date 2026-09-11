export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار تایید",
  CONFIRMED: "تایید شده",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

export const ORDER_STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-primary/10 text-primary",
  SHIPPED: "bg-accent/10 text-accent",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
};

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
