type EventStatusMessageVariant = 'error' | 'success' | 'warning';

interface EventStatusMessageProps {
  variant: EventStatusMessageVariant;
  title: string;
  description?: React.ReactNode;
}

const variantStyles: Record<
  EventStatusMessageVariant,
  { bg: string; border: string; text: string }
> = {
  error: {
    bg: 'bg-ma-red/10',
    border: 'border-ma-red',
    text: 'text-ma-red',
  },
  success: {
    bg: 'bg-emerald-300/10',
    border: 'border-emerald-700',
    text: 'text-emerald-700',
  },
  warning: {
    bg: 'bg-orange-300/10',
    border: 'border-orange-700',
    text: 'text-orange-700',
  },
};

export const EventStatusMessage: React.FC<EventStatusMessageProps> = ({
  variant,
  title,
  description,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`flex flex-col justify-center items-center text-center rounded-xl w-full h-48 ${styles.bg} border-dashed ${styles.border} border-2 gap-2`}
    >
      <h3 className={`font-semibold ${styles.text} text-2xl capitalize`}>
        {title}
      </h3>
      {description && <p className={`${styles.text} opacity-80`}>{description}</p>}
    </div>
  );
};
