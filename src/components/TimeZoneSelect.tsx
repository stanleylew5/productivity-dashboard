import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import useTimeZones from "../hooks/useTimeZones";

const TimeZoneSelect = () => {
  const { timeZones, loading, error } = useTimeZones();
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");

  if (loading) return <p>Loading time zones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Select
      value={selectedTimeZone}
      onValueChange={(value) => setSelectedTimeZone(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {timeZones.map((timeZone, index) => (
          <SelectItem key={index} value={timeZone}>
            {timeZone}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeZoneSelect;
