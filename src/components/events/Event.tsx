interface EventProps {
  name: string;
  dateTime: string;
  location: string;
}

const Event: React.FC<EventProps> = ({ name, dateTime, location }) => {
  // Check if dateTime is valid before creating a new Date
  const date = new Date(dateTime);
  const isValidDate = !isNaN(date.getTime());

  // Format date and time only if dateTime is valid
  const formattedDate = isValidDate
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(date)
    : "Invalid Date";

  const formattedTime = isValidDate
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date)
    : "Invalid Time";

  return (
    <div className="flex h-[13vh] w-[20vw] flex-col justify-center rounded-lg bg-dash-black-100 p-4 opacity-[78]">
      <p className="text-[1.9vh]">{name}</p>
      <p className="text-[1.4vh]">
        {formattedDate} ⋅ {formattedTime}
      </p>
      <p className="text-[1.4vh]">{location}</p>
    </div>
  );
};

export default Event;
