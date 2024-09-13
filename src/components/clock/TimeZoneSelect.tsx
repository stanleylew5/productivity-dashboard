import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import useTimeZones from "../../hooks/useTimeZones";

interface TimeZoneSelectProps {
  onSelect: (timezone: string) => void;
}

const TimeZoneSelect: React.FC<TimeZoneSelectProps> = ({ onSelect }) => {
  const { timeZones, loading, error } = useTimeZones();
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");

  if (loading) return <p>Loading time zones...</p>;
  if (error) return <p>{error}</p>;

  const handleSelectChange = (value: string) => {
    setSelectedTimeZone(value);
    onSelect(value);
  };

  return (
    <Select value={selectedTimeZone} onValueChange={handleSelectChange}>
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
